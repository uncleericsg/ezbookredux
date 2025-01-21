import { APIError } from '@/utils/apiErrors';

export interface ServiceResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: APIError;
}

export type AsyncServiceResponse<T> = Promise<ServiceResponse<T>>;

export const createServiceHandler = <T>() => {
  return async (operation: () => Promise<T>): AsyncServiceResponse<T> => {
    try {
      const result = await operation();
      return {
        status: 'success',
        data: result
      };
    } catch (error) {
      if (error instanceof APIError) {
        return {
          status: 'error',
          error
        };
      }
      return {
        status: 'error',
        error: new APIError(
          'UNKNOWN_ERROR',
          error instanceof Error ? error.message : 'Unknown error occurred',
          500,
          { originalError: error }
        )
      };
    }
  };
};