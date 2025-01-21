import type { AppError, ErrorCode } from '@shared/types/error';
import { BaseError } from '@shared/types/error';

export const createApiError = (
  message: string, 
  code: ErrorCode, 
  details?: Record<string, unknown>
) => {
  return new BaseError(message, code, details);
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
    case 'AUTH_INVALID_CREDENTIALS':
    case 'AUTH_TOKEN_EXPIRED':
    case 'AUTH_INVALID_TOKEN':
    case 'UNAUTHORIZED':
      return 401;

    case 'AUTHORIZATION_ERROR':
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

    case 'VALIDATION_ERROR':
    case 'INVALID_INPUT':
    case 'MISSING_REQUIRED_FIELD':
    case 'INVALID_FORMAT':
    case 'OUT_OF_RANGE':
    case 'UNPROCESSABLE_ENTITY':
      return 422;

    case 'TOO_MANY_REQUESTS':
    case 'RATE_LIMIT_EXCEEDED':
      return 429;

    case 'INTERNAL_ERROR':
    case 'DATABASE_ERROR':
    case 'SERVER_ERROR':
    case 'INTERNAL_SERVER_ERROR':
      return 500;

    case 'SERVICE_ERROR':
    case 'SERVICE_UNAVAILABLE':
    case 'EXTERNAL_API_ERROR':
    case 'INTEGRATION_ERROR':
      return 503;

    default:
      return 500;
  }
}; 