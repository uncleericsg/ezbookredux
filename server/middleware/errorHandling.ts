import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { routeError } from '@server/utils/routeError';

/**
 * Error response
 */
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void {
  // Log error details
  logger.error(error.message, {
    name: error.name,
    stack: error.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    params: req.params,
    headers: req.headers,
    ip: req.ip
  });

  // Handle API errors
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  // Handle route errors
  if (error.name === 'RouteError') {
    const routeErr = error as ReturnType<typeof routeError.create>;
    res.status(routeErr.statusCode).json({
      error: {
        code: routeErr.code,
        message: routeErr.message,
        details: routeErr.details
      }
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: (error as any).details
      }
    });
    return;
  }

  // Handle database errors
  if (error.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: {
          code: (error as any).code,
          meta: (error as any).meta
        }
      }
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }
  });
}
