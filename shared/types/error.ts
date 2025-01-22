/**
 * Standard error codes used throughout the application
 */
export type ErrorCode =
  // Authentication Errors
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTHORIZATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  // Resource Errors
  | 'RECORD_NOT_FOUND'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'CONFLICT'
  | 'DUPLICATE_ENTRY'
  // Validation Errors
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'OUT_OF_RANGE'
  | 'UNPROCESSABLE_ENTITY'
  | 'VALIDATION_ERROR'
  // Rate Limiting
  | 'TOO_MANY_REQUESTS'
  | 'RATE_LIMIT_EXCEEDED'
  // Server Errors
  | 'INTERNAL_ERROR'
  | 'SERVER_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR'
  // Service Errors
  | 'SERVICE_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'EXTERNAL_API_ERROR'
  | 'INTEGRATION_ERROR';

/**
 * Base error class for application errors
 */
export class BaseError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'BaseError';
  }
}

/**
 * Authentication error
 */
export class AuthError extends BaseError {
  constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'AuthError';
  }
}

/**
 * Database error
 */
export class DatabaseError extends BaseError {
  constructor(message: string, code: ErrorCode = 'DATABASE_ERROR', details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends BaseError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Application error
 */
export class AppError extends BaseError {
  constructor(message: string, code: ErrorCode, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'AppError';
  }
}

/**
 * Helper to create a new error with the correct type
 */
export function createError(
  message: string,
  code: ErrorCode,
  details?: Record<string, unknown>
): BaseError {
  return new BaseError(message, code, details);
}

/**
 * Get HTTP status code for an error
 */
export function getHttpStatus(code: ErrorCode): number {
  switch (code) {
    case 'AUTH_INVALID_CREDENTIALS':
    case 'AUTH_TOKEN_EXPIRED':
    case 'AUTH_INVALID_TOKEN':
    case 'UNAUTHORIZED':
      return 401;
    case 'AUTHORIZATION_ERROR':
    case 'FORBIDDEN':
      return 403;
    case 'RECORD_NOT_FOUND':
    case 'NOT_FOUND':
      return 404;
    case 'METHOD_NOT_ALLOWED':
      return 405;
    case 'CONFLICT':
    case 'DUPLICATE_ENTRY':
      return 409;
    case 'INVALID_INPUT':
    case 'MISSING_REQUIRED_FIELD':
    case 'INVALID_FORMAT':
    case 'OUT_OF_RANGE':
    case 'UNPROCESSABLE_ENTITY':
    case 'VALIDATION_ERROR':
      return 422;
    case 'TOO_MANY_REQUESTS':
    case 'RATE_LIMIT_EXCEEDED':
      return 429;
    case 'INTERNAL_ERROR':
    case 'SERVER_ERROR':
    case 'INTERNAL_SERVER_ERROR':
    case 'DATABASE_ERROR':
    case 'UNKNOWN_ERROR':
      return 500;
    case 'SERVICE_ERROR':
    case 'SERVICE_UNAVAILABLE':
    case 'EXTERNAL_API_ERROR':
    case 'INTEGRATION_ERROR':
      return 503;
    default:
      return 500;
  }
}
