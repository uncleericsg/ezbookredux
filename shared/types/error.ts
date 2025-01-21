// Common error codes shared across the application
export type ErrorCode = 
  // Common errors
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'SERVER_ERROR'
  | 'SERVICE_ERROR'
  | 'SERVICE_UNAVAILABLE'
  
  // Auth specific errors
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  
  // Input validation errors
  | 'BAD_REQUEST'
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'OUT_OF_RANGE'
  | 'UNPROCESSABLE_ENTITY'
  
  // Database errors
  | 'DB_ERROR'
  | 'RECORD_NOT_FOUND'
  | 'DUPLICATE_ENTRY'
  | 'FOREIGN_KEY_VIOLATION'
  
  // API errors
  | 'METHOD_NOT_ALLOWED'
  | 'TOO_MANY_REQUESTS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'INTEGRATION_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CONNECTION_ERROR';

export interface DatabaseError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface AppError extends Error {
  code: ErrorCode;
  details?: Record<string, unknown>;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
  code: ErrorCode;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  code: ErrorCode;
  errors?: ValidationError[];
  stack?: string;
}

// Error class implementations
export class BaseError extends Error implements AppError {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: Record<string, unknown>,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationFailedError extends BaseError {
  constructor(errors: ValidationError[]) {
    super(
      'Validation failed',
      'VALIDATION_ERROR',
      { errors },
      true
    );
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', undefined, true);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = 'Not authorized') {
    super(message, 'AUTHORIZATION_ERROR', undefined, true);
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', { resource }, true);
  }
}

export class DatabaseOperationError extends BaseError {
  constructor(
    operation: string,
    details?: Record<string, unknown>
  ) {
    super(
      `Database operation '${operation}' failed`,
      'DATABASE_ERROR',
      details,
      true
    );
  }
}

// Type guards
export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'field' in error &&
    'message' in error &&
    'type' in error &&
    'code' in error
  );
};

export const isAppError = (error: unknown): error is AppError => {
  return (
    error instanceof BaseError ||
    (error instanceof Error &&
      'code' in error &&
      'isOperational' in error)
  );
};

// Auth specific error class
export class AuthError extends BaseError {
  constructor(
    message: string,
    code: Extract<ErrorCode, 
      | 'AUTH_INVALID_CREDENTIALS'
      | 'AUTH_USER_NOT_FOUND'
      | 'AUTH_TOKEN_EXPIRED'
      | 'AUTH_INVALID_TOKEN'
      | 'AUTH_NETWORK_ERROR'
    >,
    details?: Record<string, unknown>
  ) {
    super(message, code, details, true);
  }
}
