import { AppError, ErrorCode, ErrorMetadata } from '@shared/types/error';

export function createError(code: ErrorCode, message?: string): AppError {
  return new AppError(code, message || getDefaultMessage(code), getStatusCode(code));
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMetadata(error: unknown): ErrorMetadata {
  if (error instanceof AppError) {
    return error.details || {};
  }
  return {
    message: error instanceof Error ? error.message : String(error)
  };
}

function getDefaultMessage(code: ErrorCode): string {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 'Validation failed';
    case 'UNAUTHORIZED':
      return 'Authentication required';
    case 'FORBIDDEN':
      return 'Not authorized';
    case 'NOT_FOUND':
      return 'Resource not found';
    case 'CONFLICT':
      return 'Resource conflict';
    case 'INTERNAL_SERVER_ERROR':
      return 'Internal server error';
    case 'TOO_MANY_REQUESTS':
      return 'Rate limit exceeded';
    case 'DB_ERROR':
      return 'Database error';
    case 'SERVICE_ERROR':
      return 'Service error';
    case 'SERVICE_UNAVAILABLE':
      return 'Service unavailable';
    default:
      return 'An unexpected error occurred';
  }
}

function getStatusCode(code: ErrorCode): number {
  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
    case 'INVALID_INPUT':
    case 'MISSING_REQUIRED_FIELD':
    case 'INVALID_FORMAT':
    case 'OUT_OF_RANGE':
      return 400;
    case 'UNAUTHORIZED':
    case 'AUTH_ERROR':
    case 'INVALID_CREDENTIALS':
    case 'TOKEN_EXPIRED':
    case 'TOKEN_INVALID':
    case 'SESSION_EXPIRED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
    case 'RECORD_NOT_FOUND':
      return 404;
    case 'METHOD_NOT_ALLOWED':
      return 405;
    case 'CONFLICT':
    case 'DUPLICATE_ENTRY':
      return 409;
    case 'UNPROCESSABLE_ENTITY':
      return 422;
    case 'TOO_MANY_REQUESTS':
    case 'RATE_LIMIT_EXCEEDED':
      return 429;
    case 'INTERNAL_SERVER_ERROR':
    case 'DB_ERROR':
    case 'SERVICE_ERROR':
    case 'EXTERNAL_API_ERROR':
    case 'INTEGRATION_ERROR':
    case 'TIMEOUT_ERROR':
    case 'FOREIGN_KEY_VIOLATION':
    case 'CONNECTION_ERROR':
      return 500;
    case 'SERVICE_UNAVAILABLE':
      return 503;
    default:
      return 500;
  }
} 