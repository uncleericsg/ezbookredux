import type { DatabaseError } from '@shared/types/error';

export interface ServiceResponse<T> {
  data?: T;
  error?: ServiceError;
  status: 'success' | 'error';
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

export type AsyncServiceResponse<T> = Promise<ServiceResponse<T>>;

export const createServiceHandler = <T>() => {
  return async (promise: Promise<T>): AsyncServiceResponse<T> => {
    try {
      const data = await promise;
      return { data, status: 'success' };
    } catch (err: unknown) {
      return {
        error: {
          code: err instanceof Error ? err.name : 'UNKNOWN_ERROR',
          message: err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? { stack: err.stack } : undefined
        },
        status: 'error'
      };
    }
  };
};

export const isServiceError = (response: ServiceResponse<unknown>): response is ServiceResponse<never> & { error: ServiceError } => {
  return response.status === 'error' && response.error !== undefined;
};

export const isServiceSuccess = <T>(response: ServiceResponse<T>): response is ServiceResponse<T> & { data: T } => {
  return response.status === 'success' && response.data !== undefined;
};