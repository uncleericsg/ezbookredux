export interface AppError extends Error {
  code: string;
  details?: Record<string, unknown>;
  isOperational: boolean;
}

export class APIError extends Error implements AppError {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
    this.isOperational = true;
  }

  public isOperational: boolean;
}

export const handleValidationError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;
  
  return new APIError(
    'VALIDATION_ERROR',
    error instanceof Error ? error.message : 'Validation failed',
    400,
    error instanceof Error ? { stack: error.stack } : undefined
  );
};

export const handleAuthenticationError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;
  
  return new APIError(
    'AUTH_ERROR',
    error instanceof Error ? error.message : 'Authentication failed',
    401,
    error instanceof Error ? { stack: error.stack } : undefined
  );
};

export const handleDatabaseError = (error: unknown): APIError => {
  return new APIError(
    error instanceof Error ? error.name : 'DATABASE_ERROR',
    error instanceof Error ? error.message : 'Database operation failed',
    500,
    error instanceof Error ? { stack: error.stack } : undefined
  );
};

export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};