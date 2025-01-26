import type {
  BaseEntity,
  AuditableEntity,
  BaseError,
  ValidationError,
  AuthenticationError,
  BusinessError,
  SystemError
} from './types';

/**
 * Type guard for BaseEntity
 */
export const isBaseEntity = (value: unknown): value is BaseEntity => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'createdAt' in value &&
    'updatedAt' in value
  );
};

/**
 * Type guard for AuditableEntity
 */
export const isAuditableEntity = (value: unknown): value is AuditableEntity => {
  return (
    isBaseEntity(value) &&
    'createdBy' in value &&
    'updatedBy' in value &&
    'version' in value
  );
};

/**
 * Type guard for BaseError
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
 */
export const isValidationError = (value: unknown): value is ValidationError => {
  return isError(value) && value.type === 'VALIDATION_ERROR' && 'fields' in value;
};

/**
 * Type guard for AuthenticationError
 */
export const isAuthenticationError = (value: unknown): value is AuthenticationError => {
  return isError(value) && value.type === 'AUTHENTICATION_ERROR' && 'provider' in value;
};

/**
 * Type guard for BusinessError
 */
export const isBusinessError = (value: unknown): value is BusinessError => {
  return isError(value) && value.type === 'BUSINESS_ERROR' && 'ruleCode' in value;
};

/**
 * Type guard for SystemError
 */
export const isSystemError = (value: unknown): value is SystemError => {
  return isError(value) && value.type === 'SYSTEM_ERROR';
};

/**
 * Creates a type guard factory function
 */
export const createTypeGuard = <T>(
  check: (value: unknown) => boolean
): (value: unknown) => value is T => {
  return (value: unknown): value is T => check(value);
};

/**
 * Validation rule interface
 */
export interface ValidationRule<T> {
  /**
   * Validates if value matches type T
   */
  validate(value: unknown): value is T;

  /**
   * Error message if validation fails
   */
  message: string;
}

/**
 * Creates a validation rule
 */
export const createValidationRule = <T>(
  validate: (value: unknown) => value is T,
  message: string
): ValidationRule<T> => ({
  validate,
  message
});