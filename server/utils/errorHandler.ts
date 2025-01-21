import { Request } from 'express';
import { ApiError, ApiErrorCode, isApiError } from './apiErrors';
import { logger } from './logger';

export interface ErrorHandlerConfig {
  logErrors?: boolean;
  includeErrorDetails?: boolean;
  errorTransformer?: (error: Error) => ApiError;
}

export interface ErrorMetadata {
  [key: string]: unknown;
  message: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
    statusCode: number;
  };
  request?: {
    method: string;
    url: string;
    query: unknown;
    headers: unknown;
    body: unknown;
  };
}

export class ErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      logErrors: true,
      includeErrorDetails: process.env.NODE_ENV !== 'production',
      ...config
    };
  }

  /**
   * Transform any error into an ApiError
   */
  public transformError(error: unknown): ApiError {
    if (isApiError(error)) {
      return error;
    }

    if (this.config.errorTransformer && error instanceof Error) {
      return this.config.errorTransformer(error);
    }

    return ApiError.fromError(error);
  }

  /**
   * Log error with appropriate level and metadata
   */
  public logError(error: ApiError, req?: Request): void {
    if (!this.config.logErrors) {
      return;
    }

    const errorMessage = `${error.code}: ${error.message}`;
    const metadata: ErrorMetadata = {
      message: errorMessage,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        statusCode: error.statusCode
      }
    };

    if (req) {
      metadata.request = {
        method: req.method,
        url: req.url,
        query: req.query,
        headers: req.headers,
        body: req.body
      };
    }

    if (error.statusCode >= 500) {
      logger.error(errorMessage, metadata);
    } else {
      logger.warn(errorMessage, metadata);
    }
  }

  /**
   * Format error response for client
   */
  public formatErrorResponse(error: ApiError): { error: { code: string; message: string; details?: unknown } } {
    return {
      error: {
        code: error.code,
        message: error.message,
        ...(this.config.includeErrorDetails && error.details ? { details: error.details } : {})
      }
    };
  }

  /**
   * Handle error by transforming, logging, and formatting response
   */
  public handleError(error: unknown, req?: Request): { statusCode: number; body: { error: { code: string; message: string; details?: unknown } } } {
    const apiError = this.transformError(error);
    this.logError(apiError, req);
    return {
      statusCode: apiError.statusCode,
      body: this.formatErrorResponse(apiError)
    };
  }

  /**
   * Create common error instances
   */
  public static errors = {
    notFound: (resource: string) => 
      ApiError.notFound(resource),
    
    invalidRequest: (message: string) => 
      ApiError.validation(message),
    
    unauthorized: (message = 'Unauthorized') => 
      ApiError.unauthorized(message),
    
    forbidden: (message = 'Forbidden') => 
      ApiError.forbidden(message),
    
    methodNotAllowed: (method: string) => 
      ApiError.badRequest(`Method ${method} not allowed`),
    
    serverError: (message = 'Internal server error') => 
      ApiError.server(message)
  };
}
