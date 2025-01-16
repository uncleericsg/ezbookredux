import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@server/utils/logger';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

// Not found error handler
export const notFoundHandler = (req: Request, res: Response) => {
  const response: ErrorResponse = {
    error: {
      message: `Cannot ${req.method} ${req.path}`,
      code: 'ROUTE_NOT_FOUND'
    }
  };
  res.status(404).json(response);
};

// Global error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error caught in global error handler', {
    error: err,
    path: req.path,
    method: req.method
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: err.errors
      }
    };
    return res.status(400).json(response);
  }

  // Handle custom API errors
  if (err instanceof APIError) {
    const response: ErrorResponse = {
      error: {
        message: err.message,
        code: err.code,
        details: err.details
      }
    };
    return res.status(err.status).json(response);
  }

  // Handle database connection errors
  if (err.message?.includes('database') || err.message?.includes('connection')) {
    const response: ErrorResponse = {
      error: {
        message: 'Database error occurred',
        code: 'DATABASE_ERROR'
      }
    };
    return res.status(503).json(response);
  }

  // Handle rate limit errors
  if (err.message?.includes('rate limit')) {
    const response: ErrorResponse = {
      error: {
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED'
      }
    };
    return res.status(429).json(response);
  }

  // Default error response
  const response: ErrorResponse = {
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      code: 'INTERNAL_SERVER_ERROR'
    }
  };
  res.status(500).json(response);
};

// Async route handler wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 