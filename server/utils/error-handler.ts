import { ApiError } from '@server/utils/apiErrors';
import { errorReportingService } from '@server/utils/errorReporting';


import type { Request, Response, NextFunction } from 'express';


interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Report error to monitoring service
  errorReportingService.reportError(err, 'Backend Error Handler', req);

  // Handle specific error types
  let status = 500;
  let response: ErrorResponse = {
    status,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
  };

  if (err instanceof ApiError) {
    status = err.statusCode;
    response = {
      status,
      message: err.message,
      code: err.code,
      details: err.details,
      timestamp: new Date().toISOString(),
    };
  }

  // Log error details
  console.error(`[${new Date().toISOString()}] Error:`, {
    status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Send error response
  res.status(status).json(response);
};

export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };