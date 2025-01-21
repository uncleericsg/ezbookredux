/**
 * API error codes
 */
export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: keyof typeof ApiErrorCode,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    const message = error instanceof Error ? error.message : String(error);
    return new ApiError(message, 'INTERNAL_SERVER_ERROR', 500, error);
  }

  static notFound(resource: string, id?: string): ApiError {
    const message = id 
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    return new ApiError(message, 'NOT_FOUND', 404);
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(message, 'BAD_REQUEST', 400, details);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 'UNAUTHORIZED', 401);
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 'FORBIDDEN', 403);
  }

  static validation(message: string, details?: unknown): ApiError {
    return new ApiError(message, 'VALIDATION_ERROR', 400, details);
  }

  static database(message: string = 'Database error', details?: unknown): ApiError {
    return new ApiError(message, 'DATABASE_ERROR', 500, details);
  }

  static server(message: string = 'Internal server error', details?: unknown): ApiError {
    return new ApiError(message, 'INTERNAL_SERVER_ERROR', 500, details);
  }
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    code: keyof typeof ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

/**
 * Create API error response
 */
export function createApiError(
  message: string,
  code: keyof typeof ApiErrorCode,
  details?: unknown
): ApiErrorResponse {
  return {
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
}

/**
 * Convert validation errors to API error
 */
export function createValidationError(
  message: string,
  errors: Array<{ path: (string | number)[]; message: string; type: string }>
): ApiError {
  return ApiError.validation(message, errors.map(error => ({
    field: error.path.join('.'),
    message: error.message,
    type: error.type
  })));
}
