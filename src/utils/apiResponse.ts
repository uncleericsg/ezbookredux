import { ErrorCode } from '@shared/types/error';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

export function createApiError(message: string, code: ErrorCode, details?: Record<string, unknown>): ApiResponse<never> {
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