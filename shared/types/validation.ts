/**
 * Validation rule definition
 */
export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: 'INVALID_INPUT' | 'MISSING_REQUIRED_FIELD' | 'INVALID_FORMAT';
}

/**
 * Field validation schema
 */
export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

/**
 * Validation context
 */
export interface ValidationContext {
  field: string;
  value: unknown;
  schema: ValidationSchema;
  data?: Record<string, unknown>;
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: {
    validate: (value: unknown) => value !== undefined && value !== null && value !== '',
    message: 'This field is required'
  },
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Invalid email format'
  },
  phone: {
    validate: (value: string) => /^\+?[\d\s-]{10,}$/.test(value),
    message: 'Invalid phone number format'
  },
  minLength: (min: number): ValidationRule => ({
    validate: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  maxLength: (max: number): ValidationRule => ({
    validate: (value: string) => value.length <= max,
    message: `Must be no more than ${max} characters`
  })
} as const;
