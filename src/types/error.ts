export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'METHOD_NOT_ALLOWED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONFIGURATION_ERROR'
  | 'DATABASE_ERROR'
  | 'STRIPE_ERROR'
  | 'PAYMENT_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR';

export interface ErrorMetadata {
  [key: string]: any;
}

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly details?: ErrorMetadata;
  public readonly statusCode: number;

  constructor(message: string, code: ApiErrorCode, details?: ErrorMetadata) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.statusCode = this.getStatusCode(code);
  }

  static fromError(error: unknown, defaultCode: ApiErrorCode = 'INTERNAL_SERVER_ERROR'): ApiError {
    if (error instanceof ApiError) {
      return error;
    }
    const message = error instanceof Error ? error.message : String(error);
    return new ApiError(message, defaultCode);
  }

  private getStatusCode(code: ApiErrorCode): number {
    switch (code) {
      case 'VALIDATION_ERROR':
        return 400;
      case 'AUTHENTICATION_ERROR':
        return 401;
      case 'AUTHORIZATION_ERROR':
        return 403;
      case 'NOT_FOUND':
        return 404;
      case 'METHOD_NOT_ALLOWED':
        return 405;
      case 'CONFLICT':
        return 409;
      case 'RATE_LIMIT_EXCEEDED':
        return 429;
      case 'CONFIGURATION_ERROR':
      case 'DATABASE_ERROR':
      case 'STRIPE_ERROR':
      case 'PAYMENT_ERROR':
      case 'SERVICE_UNAVAILABLE':
      case 'INTERNAL_SERVER_ERROR':
        return 500;
      default:
        return 500;
    }
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function getErrorDetails(error: unknown): ErrorMetadata | undefined {
  if (error instanceof ApiError) {
    return error.details;
  }
  return undefined;
}

export function createApiError(code: ApiErrorCode, message?: string): ApiError {
  return new ApiError(message || getDefaultMessage(code), code);
}

function getDefaultMessage(code: ApiErrorCode): string {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 'Validation failed';
    case 'AUTHENTICATION_ERROR':
      return 'Authentication required';
    case 'AUTHORIZATION_ERROR':
      return 'Not authorized';
    case 'NOT_FOUND':
      return 'Resource not found';
    case 'CONFLICT':
      return 'Resource conflict';
    case 'CONFIGURATION_ERROR':
      return 'Configuration error';
    case 'RATE_LIMIT_EXCEEDED':
      return 'Rate limit exceeded';
    case 'DATABASE_ERROR':
      return 'Database error';
    case 'STRIPE_ERROR':
      return 'Payment processing error';
    case 'PAYMENT_ERROR':
      return 'Payment error';
    case 'SERVICE_UNAVAILABLE':
      return 'Service unavailable';
    case 'METHOD_NOT_ALLOWED':
      return 'Method not allowed';
    default:
      return 'An unexpected error occurred';
  }
} 