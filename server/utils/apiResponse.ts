import { ApiErrorCode } from './apiErrors';
import type { ApiErrorResponse } from '@shared/types/middleware';

/**
 * Creates a standardized API error response
 */
export function createApiError(
  message: string,
  code: ApiErrorCode | string,
  details?: unknown
): ApiErrorResponse {
  return {
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
}
