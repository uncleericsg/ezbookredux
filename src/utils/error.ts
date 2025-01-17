import { ApiError, ApiErrorCode, ErrorMetadata } from '@/types/error';

export function createError(code: ApiErrorCode, message?: string): ApiError {
  return ApiError.fromCode(code, message);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function getErrorDetails(error: unknown): ErrorMetadata | undefined {
  if (error instanceof ApiError) {
    return error.details;
  }
  return undefined;
} 