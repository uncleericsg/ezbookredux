import type { ApiErrorCode } from '../types/api';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(message: string, code: ApiErrorCode, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function handleUnknownError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'INTERNAL_SERVER_ERROR', {
      name: error.name,
      stack: error.stack
    });
  }

  return new ApiError(
    'An unexpected error occurred',
    'INTERNAL_SERVER_ERROR',
    { originalError: error }
  );
}