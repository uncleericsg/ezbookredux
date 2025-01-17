import { ApiError, ApiErrorCode } from '@/types/error';
import type { Response } from 'express';

export function handleError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  const message = error instanceof Error ? error.message : String(error);
  return new ApiError(message, 'SERVICE_UNAVAILABLE');
}

export function sendErrorResponse(res: Response, apiError: ApiError): void {
  const errorResponse = {
    success: false,
    error: {
      code: apiError.code,
      message: apiError.message,
      details: apiError.details
    }
  };
  res.status(apiError.statusCode).json(errorResponse);
}

export function handleValidationError(message?: string): never {
  throw new ApiError(message || 'Validation failed', 'VALIDATION_ERROR');
}

export function handleAuthenticationError(message?: string): never {
  throw new ApiError(message || 'Authentication required', 'AUTHENTICATION_ERROR');
}

export function handleAuthorizationError(message?: string): never {
  throw new ApiError(message || 'Not authorized', 'AUTHORIZATION_ERROR');
}

export function handleNotFoundError(message?: string): never {
  throw new ApiError(message || 'Resource not found', 'NOT_FOUND');
}

export function handleConflictError(message?: string): never {
  throw new ApiError(message || 'Resource conflict', 'CONFLICT');
}

export function handleConfigurationError(message?: string): never {
  throw new ApiError(message || 'Configuration error', 'CONFIGURATION_ERROR');
}

export function handleRateLimitError(message?: string): never {
  throw new ApiError(message || 'Rate limit exceeded', 'RATE_LIMIT_EXCEEDED');
}

export function handleDatabaseError(message?: string): never {
  throw new ApiError(message || 'Database error', 'DATABASE_ERROR');
}

export function handleStripeError(message?: string): never {
  throw new ApiError(message || 'Payment processing error', 'STRIPE_ERROR');
}

export function handlePaymentError(message?: string): never {
  throw new ApiError(message || 'Payment error', 'PAYMENT_ERROR');
}

export function handleServiceUnavailableError(message?: string): never {
  throw new ApiError(message || 'Service unavailable', 'SERVICE_UNAVAILABLE');
}

export function createError(code: ApiErrorCode, message?: string): ApiError {
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
