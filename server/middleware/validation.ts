import type { Request, Response, NextFunction } from 'express';
import {
  ValidationSchema,
  ValidationOptions,
  ValidationResult,
  ValidationContext,
  ValidationRule,
  ValidationRuleConfig,
  ValidationMiddlewareConfig,
  ValidationHandler,
  ValidationMiddlewareFactory,
  VALIDATION_RULES
} from '@shared/types/validation';
import { ValidationError } from '@shared/types/error';
import { logger } from '@server/utils/logger';

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: ValidationOptions = {
  abortEarly: false,
  stripUnknown: true,
  allowNull: false
};

/**
 * Get validation rule config
 */
function getRuleConfig(rule: ValidationRule | ValidationRuleConfig): ValidationRuleConfig {
  return typeof rule === 'string' ? VALIDATION_RULES[rule] : rule;
}

/**
 * Validate a single value against a rule
 */
async function validateValue(
  value: unknown,
  rule: ValidationRuleConfig,
  context: ValidationContext
): Promise<boolean> {
  // Handle null values
  if (value === null || value === undefined) {
    return !rule.required;
  }

  // Type validation
  switch (rule.type) {
    case 'string':
      if (typeof value !== 'string') return false;
      break;
    case 'number':
      if (typeof value !== 'number') return false;
      break;
    case 'boolean':
      if (typeof value !== 'boolean') return false;
      break;
    case 'array':
      if (!Array.isArray(value)) return false;
      break;
    case 'object':
      if (typeof value !== 'object' || Array.isArray(value)) return false;
      break;
    case 'date':
      if (!(value instanceof Date) && isNaN(Date.parse(String(value)))) return false;
      break;
  }

  // Additional validations
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return false;
  }

  if (rule.enum && !rule.enum.includes(value)) {
    return false;
  }

  if (typeof rule.min === 'number') {
    if (typeof value === 'number' && value < rule.min) return false;
    if (typeof value === 'string' && value.length < rule.min) return false;
    if (Array.isArray(value) && value.length < rule.min) return false;
  }

  if (typeof rule.max === 'number') {
    if (typeof value === 'number' && value > rule.max) return false;
    if (typeof value === 'string' && value.length > rule.max) return false;
    if (Array.isArray(value) && value.length > rule.max) return false;
  }

  if (typeof rule.length === 'number') {
    if (typeof value === 'string' && value.length !== rule.length) return false;
    if (Array.isArray(value) && value.length !== rule.length) return false;
  }

  // Custom validation
  if (rule.validate) {
    return rule.validate(value);
  }

  return true;
}

/**
 * Transform a value based on rule configuration
 */
function transformValue(
  value: unknown,
  rule: ValidationRuleConfig,
  context: ValidationContext
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  // Apply custom transform
  if (rule.transform) {
    return rule.transform(value);
  }

  // Built-in transforms
  switch (rule.type) {
    case 'string':
      return String(value);
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'date':
      return new Date(String(value));
    default:
      return value;
  }
}

/**
 * Validate data against schema
 */
async function validateData(
  data: Record<string, unknown>,
  schema: ValidationSchema,
  context: ValidationContext
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const validatedData: Record<string, unknown> = {};

  for (const [field, schemaRule] of Object.entries(schema)) {
    const value = data[field];

    // Handle nested schemas
    if (typeof schemaRule === 'object' && !('type' in schemaRule)) {
      if (typeof value === 'object' && value !== null) {
        const nestedResult = await validateData(
          value as Record<string, unknown>,
          schemaRule as ValidationSchema,
          context
        );
        if (!nestedResult.valid) {
          errors.push(...(nestedResult.errors || []));
        } else if (nestedResult.data) {
          validatedData[field] = nestedResult.data;
        }
        continue;
      }
    }

    // Get validation rule config
    const ruleConfig = getRuleConfig(schemaRule as ValidationRule | ValidationRuleConfig);

    try {
      const isValid = await validateValue(value, ruleConfig, context);
      if (!isValid) {
        errors.push(new ValidationError(
          ruleConfig.message || `Validation failed for field '${field}'`,
          [{
            field,
            message: ruleConfig.message || `Invalid value for field '${field}'`,
            type: ruleConfig.type,
            value
          }]
        ));
        if (context.options.abortEarly) break;
      } else {
        validatedData[field] = transformValue(value, ruleConfig, context);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(new ValidationError(
        `Validation error for field '${field}'`,
        [{
          field,
          message: errorMessage,
          type: ruleConfig.type,
          value
        }]
      ));
      if (context.options.abortEarly) break;
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data: errors.length === 0 ? validatedData : undefined
  };
}

/**
 * Create validation middleware
 */
export const createValidationMiddleware: ValidationMiddlewareFactory = (
  config: ValidationMiddlewareConfig = {}
): ValidationHandler => {
  const {
    defaultOptions = DEFAULT_OPTIONS,
    customRules = {},
    onError
  } = config;

  // Merge custom rules
  Object.assign(VALIDATION_RULES, customRules);

  return (schema: ValidationSchema, options: ValidationOptions = {}) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const context: ValidationContext = {
          req,
          options: { ...defaultOptions, ...options },
          context: options.context
        };

        const result = await validateData(req.body, schema, context);

        if (!result.valid && result.errors) {
          const error = new ValidationError(
            'Validation failed',
            result.errors[0].errors || []
          );

          if (onError) {
            onError(error, req, res, next);
          } else {
            next(error);
          }
          return;
        }

        // Attach validated data to request
        req.body = result.data;
        next();
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown validation error');
        logger.error('Validation middleware error', err);
        next(err);
      }
    };
  };
};

/**
 * Default validation middleware instance
 */
export const validate = createValidationMiddleware();
