import type { Request, Response, NextFunction } from 'express';
import type { ValidationError as ValidationErrorType } from './error';

/**
 * Validation rule type
 */
export type ValidationRule = 
  | 'required'
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'email'
  | 'url'
  | 'date'
  | 'enum'
  | 'min'
  | 'max'
  | 'length'
  | 'pattern'
  | 'custom';

/**
 * Validation schema type
 */
export type ValidationSchema = {
  [key: string]: ValidationRuleConfig | ValidationSchema;
};

/**
 * Validation rule configuration
 */
export interface ValidationRuleConfig {
  type: ValidationRule;
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  length?: number;
  pattern?: RegExp;
  enum?: unknown[];
  validate?: (value: unknown) => boolean | Promise<boolean>;
  transform?: (value: unknown) => unknown;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /**
   * Whether to abort validation on first error
   */
  abortEarly?: boolean;

  /**
   * Whether to strip unknown properties
   */
  stripUnknown?: boolean;

  /**
   * Whether to allow null values
   */
  allowNull?: boolean;

  /**
   * Custom error messages
   */
  messages?: Record<string, string>;

  /**
   * Custom validation context
   */
  context?: Record<string, unknown>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /**
   * Whether validation passed
   */
  valid: boolean;

  /**
   * Validation errors if any
   */
  errors?: ValidationErrorType[];

  /**
   * Validated and transformed data
   */
  data?: Record<string, unknown>;
}

/**
 * Validation middleware configuration
 */
export interface ValidationMiddlewareConfig {
  /**
   * Default validation options
   */
  defaultOptions?: ValidationOptions;

  /**
   * Custom validation rules
   */
  customRules?: Record<string, ValidationRuleConfig>;

  /**
   * Error handler
   */
  onError?: (error: ValidationErrorType, req: Request, res: Response, next: NextFunction) => void;
}

/**
 * Validation middleware handler
 */
export type ValidationHandler = (
  schema: ValidationSchema,
  options?: ValidationOptions
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Validation middleware factory
 */
export type ValidationMiddlewareFactory = (
  config?: ValidationMiddlewareConfig
) => ValidationHandler;

/**
 * Validation context
 */
export interface ValidationContext {
  /**
   * Request object
   */
  req: Request;

  /**
   * Custom context data
   */
  context?: Record<string, unknown>;

  /**
   * Validation options
   */
  options: ValidationOptions;
}

/**
 * Validation function type
 */
export type ValidationFunction = (
  value: unknown,
  context: ValidationContext
) => boolean | Promise<boolean>;

/**
 * Transform function type
 */
export type TransformFunction = (
  value: unknown,
  context: ValidationContext
) => unknown;

/**
 * Validation error formatter
 */
export type ValidationErrorFormatter = (
  field: string,
  rule: ValidationRule,
  message?: string,
  details?: Record<string, unknown>
) => ValidationErrorType;

/**
 * Built-in validation rules
 */
export const VALIDATION_RULES: Record<ValidationRule, ValidationRuleConfig> = {
  required: {
    type: 'required',
    message: 'Field is required'
  },
  string: {
    type: 'string',
    message: 'Must be a string'
  },
  number: {
    type: 'number',
    message: 'Must be a number'
  },
  boolean: {
    type: 'boolean',
    message: 'Must be a boolean'
  },
  array: {
    type: 'array',
    message: 'Must be an array'
  },
  object: {
    type: 'object',
    message: 'Must be an object'
  },
  email: {
    type: 'email',
    message: 'Must be a valid email address',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  url: {
    type: 'url',
    message: 'Must be a valid URL',
    pattern: /^https?:\/\/[^\s$.?#].[^\s]*$/
  },
  date: {
    type: 'date',
    message: 'Must be a valid date'
  },
  enum: {
    type: 'enum',
    message: 'Must be one of the allowed values'
  },
  min: {
    type: 'min',
    message: 'Must be greater than or equal to {min}'
  },
  max: {
    type: 'max',
    message: 'Must be less than or equal to {max}'
  },
  length: {
    type: 'length',
    message: 'Must be exactly {length} characters long'
  },
  pattern: {
    type: 'pattern',
    message: 'Must match the required pattern'
  },
  custom: {
    type: 'custom',
    message: 'Failed custom validation'
  }
};
