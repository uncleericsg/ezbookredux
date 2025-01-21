import type { ErrorCode } from '@shared/types/error';

export class APIError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export const handleValidationError = (error: unknown): APIError => {
  return new APIError(
    'VALIDATION_ERROR',
    error instanceof Error ? error.message : 'Validation failed',
    422,
    { originalError: error }
  );
};

export const handleDatabaseError = (error: unknown): APIError => {
  return new APIError(
    'DATABASE_ERROR',
    error instanceof Error ? error.message : 'Database operation failed',
    500,
    { originalError: error }
  );
};

export const handleNotFoundError = (resource: string): APIError => {
  return new APIError(
    'NOT_FOUND',
    `${resource} not found`,
    404
  );
};

export const handleConfigurationError = (error: unknown): APIError => {
  return new APIError(
    'INTERNAL_ERROR',
    error instanceof Error ? error.message : 'Configuration error',
    500,
    { originalError: error }
  );
};
