import type { AppError, ErrorCode } from '@shared/types/error';
import { BaseError } from '@shared/types/error';

export const createApiError = (message: string, code: ErrorCode, details?: Record<string, unknown>) => {
  return new BaseError(code, message, details);
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof BaseError;
};

export const getErrorDetails = (error: unknown): Record<string, unknown> => {
  if (error instanceof BaseError) {
    return error.details || {};
  }
  return {};
};

export const getStatusCode = (code: ErrorCode): number => {
  switch (code) {
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'METHOD_NOT_ALLOWED':
      return 405;
    case 'CONFLICT':
      return 409;
    case 'UNPROCESSABLE_ENTITY':
      return 422;
    case 'TOO_MANY_REQUESTS':
      return 429;
    case 'INTERNAL_SERVER_ERROR':
      return 500;
    case 'SERVICE_UNAVAILABLE':
      return 503;
    default:
      return 500;
  }
};

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