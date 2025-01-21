import { AppError } from '@shared/types/error';

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  return new AppError('SERVICE_UNAVAILABLE', error instanceof Error ? error.message : String(error));
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}