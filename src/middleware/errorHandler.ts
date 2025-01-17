import { ApiError } from '@/types/error';
import { Response } from 'express';
import { logger } from '@/lib/logger';

interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export function sendErrorResponse(res: Response, apiError: ApiError): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: apiError.code,
      message: apiError.message,
      details: apiError.details
    }
  };

  res.status(apiError.statusCode).json(errorResponse);
}

export function errorHandler(error: unknown): ApiError {
  return ApiError.fromError(error);
}

export function handle404(): never {
  throw new ApiError('Route not found', 'NOT_FOUND');
}

export function handleMethodNotAllowed(method: string): never {
  throw new ApiError(`Method ${method} not allowed`, 'METHOD_NOT_ALLOWED');
}

export function validateRequest(data: unknown): void {
  if (!data) {
    throw new ApiError('Invalid request data', 'VALIDATION_ERROR');
  }
}

export default errorHandler; 