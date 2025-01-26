import type { ErrorType, BaseError } from './types';

/**
 * Validation error interface
 */
export interface ValidationError extends BaseError {
  type: 'VALIDATION_ERROR';
  
  /**
   * List of validation errors
   */
  fields: Array<{
    /**
     * Field name that failed validation
     */
    field: string;
    
    /**
     * Validation error message
     */
    message: string;
  }>;
}

/**
 * Authentication error interface
 */
export interface AuthenticationError extends BaseError {
  type: 'AUTHENTICATION_ERROR';
  
  /**
   * Authentication provider
   */
  provider: 'local' | 'google' | 'facebook';
}

/**
 * Business rule violation error
 */
export interface BusinessError extends BaseError {
  type: 'BUSINESS_ERROR';
  
  /**
   * Business rule code
   */
  ruleCode: string;
}

/**
 * System-level error
 */
export interface SystemError extends BaseError {
  type: 'SYSTEM_ERROR';
  
  /**
   * Stack trace (only in development)
   */
  stack?: string;
}

/**
 * Creates a new error instance
 * @param type - Error type
 * @param message - Error message
 * @param metadata - Additional error metadata
 * @returns BaseError instance
 */
export const createError = <T extends ErrorType>(
  type: T,
  message: string,
  metadata?: Record<string, unknown>
): BaseError => {
  const code = `${type}_${Date.now()}`;
  
  return {
    type,
    code,
    message,
    metadata,
  };
};

/**
 * Type guard for BaseError
 * @param value - Value to check
 * @returns true if value is BaseError
 */
export const isError = (value: unknown): value is BaseError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'code' in value &&
    'message' in value
  );
};

/**
 * Type guard for ValidationError
 * @param value - Value to check
 * @returns true if value is ValidationError
 */
export const isValidationError = (value: unknown): value is ValidationError => {
  return isError(value) && value.type === 'VALIDATION_ERROR' && 'fields' in value;
};

/**
 * Type guard for AuthenticationError
 * @param value - Value to check
 * @returns true if value is AuthenticationError
 */
export const isAuthenticationError = (value: unknown): value is AuthenticationError => {
  return isError(value) && value.type === 'AUTHENTICATION_ERROR' && 'provider' in value;
};

/**
 * Type guard for BusinessError
 * @param value - Value to check
 * @returns true if value is BusinessError
 */
export const isBusinessError = (value: unknown): value is BusinessError => {
  return isError(value) && value.type === 'BUSINESS_ERROR' && 'ruleCode' in value;
};

/**
 * Type guard for SystemError
 * @param value - Value to check
 * @returns true if value is SystemError
 */
export const isSystemError = (value: unknown): value is SystemError => {
  return isError(value) && value.type === 'SYSTEM_ERROR';
};