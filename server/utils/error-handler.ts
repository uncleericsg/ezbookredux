import { ApiError, ErrorReport, ApiResponse } from '@server/types/error';
import { errorReportingService } from '@server/utils/errorReporting';

import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Report error to monitoring service
  errorReportingService.reportError(err, 'Backend Error Handler', req);

  // Handle specific error types
  let response: ApiResponse<null>;

  if (err instanceof ApiError) {
    response = {
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
        timestamp: new Date().toISOString()
      }
    };
  } else {
    response = {
      error: {
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
      }
    };
  }

  // Log error details
  console.error(`[${new Date().toISOString()}] Error:`, {
    status: err instanceof ApiError ? err.getStatusCode() : 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Send error response
  res.status(err instanceof ApiError ? err.getStatusCode() : 500).json(response);
};

export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };