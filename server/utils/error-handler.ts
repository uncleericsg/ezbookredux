import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type { 
  ApiResponse,
  ApiErrorCode 
} from '@shared/types/middleware';
import type { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error details
  logger.error('Error handler caught error', {
    error: err instanceof ApiError ? {
      code: err.code,
      message: err.message,
      details: err.details
    } : {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    request: {
      path: req.path,
      method: req.method,
      query: req.query,
      body: req.body,
      params: req.params,
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-request-id': req.headers['x-request-id']
      }
    }
  });

  // Handle specific error types
  let response: ApiResponse<null>;
  let statusCode: number;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    response = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    };
  } else {
    statusCode = 500;
    response = {
      error: {
        code: 'INTERNAL_SERVER_ERROR' as ApiErrorCode,
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? {
          name: err.name,
          message: err.message,
          stack: err.stack
        } : undefined
      }
    };
  }

  // Send error response
  res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
