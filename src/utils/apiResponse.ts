import type { ErrorCode } from '@shared/types/error';

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export function createApiError(
  message: string, 
  code: ErrorCode, 
  details?: Record<string, unknown>
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

export function createApiSuccess<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  };
} 