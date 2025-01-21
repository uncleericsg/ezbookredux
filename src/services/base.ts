import { BaseError } from '../../shared/types/error';
import type { 
  ErrorCode,
  ValidationError 
} from '../../shared/types/error';
import type { 
  ServiceResponse,
  AsyncServiceResponse
} from '../../types/api';

export abstract class BaseService {
  protected async handleRequest<T>(
    operation: () => Promise<T>,
    context?: { path?: string }
  ): AsyncServiceResponse<T> {
    const requestId = crypto.randomUUID();
    const metadata = {
      timestamp: Date.now(),
      requestId,
      path: context?.path
    };

    try {
      const data = await operation();
      return {
        data,
        status: 'success',
        metadata
      };
    } catch (err: unknown) {
      return this.handleError(err, metadata);
    }
  }

  protected handleError(
    err: unknown,
    metadata: { timestamp: number; requestId: string; path?: string }
  ): ServiceResponse<never> {
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

  protected createSuccessResponse<T>(
    data: T,
    path?: string
  ): ServiceResponse<T> {
    return {
      data,
      status: 'success',
      metadata: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
        path
      }
    };
  }

  protected createErrorResponse<T>(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
    path?: string
  ): ServiceResponse<T> {
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
        requestId: crypto.randomUUID(),
        path
      }
    };
  }

  protected createValidationErrorResponse<T>(
    errors: ValidationError[],
    path?: string
  ): ServiceResponse<T> {
    return this.createErrorResponse(
      'VALIDATION_ERROR',
      'Validation failed',
      { errors },
      path
    );
  }

  protected async withRetry<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        if (attempt === retries) break;
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, attempt - 1))
        );
      }
    }

    throw lastError;
  }

  protected logError(error: unknown, context?: Record<string, unknown>): void {
    // TODO: Implement proper error logging
    console.error('Service Error:', {
      error,
      context,
      timestamp: new Date().toISOString()
    });
  }
}