import { BaseError } from '../shared/types/error';
import type { 
  DatabaseError, 
  ErrorCode,
  ValidationError
} from '../shared/types/error';

export interface ServiceResponse<T> {
  data: T | null;
  error?: ServiceError;
  status: 'success' | 'error';
  metadata: {
    timestamp: number;
    requestId: string;
    path?: string;
  };
}

export interface ServiceError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

export type AsyncServiceResponse<T> = Promise<ServiceResponse<T>>;

export const createServiceHandler = <T>() => {
  return async (
    promise: Promise<T>,
    context?: { path?: string }
  ): AsyncServiceResponse<T> => {
    const requestId = crypto.randomUUID();
    const metadata = {
      timestamp: Date.now(),
      requestId,
      path: context?.path
    };

    try {
      const data = await promise;
      return { 
        data, 
        status: 'success',
        metadata
      };
    } catch (err: unknown) {
      // Handle known error types
      if (err instanceof BaseError) {
        return {
          data: null,
          error: {
            code: err.code,
            message: err.message,
            details: err.details
          },
          status: 'error',
          metadata
        };
      }

      // Handle unknown errors
      return {
        data: null,
        error: {
          code: 'UNKNOWN_ERROR',
          message: err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? { 
            name: err.name,
            stack: err.stack,
            cause: err.cause
          } : undefined
        },
        status: 'error',
        metadata
      };
    }
  };
};

// Enhanced type guards with specific error checking
export const isServiceError = (
  response: ServiceResponse<unknown>
): response is ServiceResponse<never> & { error: ServiceError } => {
  return response.status === 'error' && response.error !== undefined;
};

export const isServiceSuccess = <T>(
  response: ServiceResponse<T>
): response is ServiceResponse<T> & { data: T } => {
  return response.status === 'success' && response.data !== null;
};

// Helper to extract error details for logging
export const getErrorDetails = (error: ServiceError): Record<string, unknown> => {
  return {
    code: error.code,
    message: error.message,
    ...error.details
  };
};

// Helper to create typed error responses
export const createErrorResponse = <T>(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): ServiceResponse<T> => {
  return {
    data: null,
    error: {
      code,
      message,
      details
    },
    status: 'error',
    metadata: {
      timestamp: Date.now(),
      requestId: crypto.randomUUID()
    }
  };
};

// Helper to handle validation errors
export const createValidationErrorResponse = <T>(
  errors: ValidationError[]
): ServiceResponse<T> => {
  return createErrorResponse(
    'VALIDATION_ERROR',
    'Validation failed',
    { errors }
  );
};