import { ApiResponse, ApiErrorCode } from '../types/api';

export function createApiResponse<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return {
    data,
    meta
  };
}

export function createApiError(message: string, code: ApiErrorCode, details?: any): ApiResponse<never> {
  return {
    error: {
      message,
      code,
      details
    }
  };
} 