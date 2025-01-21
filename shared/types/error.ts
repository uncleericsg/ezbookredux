import type { Request, Response, NextFunction } from 'express';

/**
 * Error codes for different types of errors
 */
export type ErrorCode =
  // HTTP Status Codes
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  
  // Validation Errors
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'OUT_OF_RANGE'
  
  // Authentication Errors
  | 'AUTH_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  
  // Database Errors
  | 'DB_ERROR'
  | 'RECORD_NOT_FOUND'
  | 'DUPLICATE_ENTRY'
  | 'FOREIGN_KEY_VIOLATION'
  | 'CONNECTION_ERROR'
  
  // Service Errors
  | 'SERVICE_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTEGRATION_ERROR'
  | 'TIMEOUT_ERROR';

/**
 * Base error class for application errors
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Convert error to JSON for response
   */
  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details })
    };
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors: ValidationErrorDetail[],
    details?: Record<string, unknown>
  ) {
    super('VALIDATION_ERROR', message, 400, {
      ...details,
      validationErrors: errors
    });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Validation error detail interface
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  type: string;
  value?: unknown;
}

/**
 * Database error class
 */
export class DatabaseError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = 'DB_ERROR',
    details?: Record<string, unknown>
  ) {
    super(code, message, 500, details);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Service error class
 */
export class ServiceError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = 'SERVICE_ERROR',
    details?: Record<string, unknown>
  ) {
    super(code, message, 500, details);
    this.name = 'ServiceError';
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  /**
   * Whether to log errors
   */
  logErrors: boolean;

  /**
   * Whether to include stack traces in error responses
   */
  includeStack: boolean;

  /**
   * Custom error formatter
   */
  formatError?: (error: Error) => Record<string, unknown>;

  /**
   * Custom error logger
   */
  logError?: (error: Error, req: Request) => void;

  /**
   * Whether to expose error details in production
   */
  exposeErrors: boolean;

  /**
   * Default error messages by status code
   */
  defaultMessages?: Record<number, string>;

  /**
   * Custom error handlers by error type
   */
  handlers?: Record<string, ErrorHandler>;
}

/**
 * Error handler function type
 */
export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

/**
 * Error response interface
 */
export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

/**
 * Error handler middleware factory
 */
export type ErrorHandlerFactory = (
  config: ErrorHandlerConfig
) => ErrorHandler;
