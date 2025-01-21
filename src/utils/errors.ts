import type { AppError } from '@shared/types/error';
import { BaseError } from '@shared/types/error';

export function handleError(error: unknown): AppError {
  if (error instanceof BaseError) {
    return error;
  }
  return new BaseError(
    error instanceof Error ? error.message : String(error),
    'INTERNAL_ERROR'
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof BaseError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}