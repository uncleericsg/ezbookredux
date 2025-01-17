export type ApiErrorCode =
  | 'INVALID_REQUEST'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'PAYMENT_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'FIREBASE_AUTH_ERROR'
  | 'FIREBASE_DB_ERROR'
  | 'STRIPE_ERROR'
  | 'STRIPE_WEBHOOK_ERROR'
  | 'STRIPE_PAYMENT_INTENT_ERROR'
  | 'STRIPE_STATUS_UPDATE_ERROR'
  | 'MAPS_ERROR'
  | 'SERVICE_INIT_ERROR'
  | 'PRICING_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'SERVICE_ERROR'
  | 'PAYMENT_ERROR'
  | 'SERVICE_MANAGER_ERROR'
  | 'DATABASE_ERROR';

export interface ErrorMetadata {
  name?: string;
  message: string;
  stack?: string;
  code?: ApiErrorCode;
  details?: Record<string, unknown>;
  timestamp?: string;
  environment?: string;
  context?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  public getStatusCode(): number {
    switch (this.code) {
      case 'NOT_FOUND':
        return 404;
      case 'BAD_REQUEST':
      case 'INVALID_REQUEST':
      case 'VALIDATION_ERROR':
        return 400;
      case 'UNAUTHORIZED':
        return 401;
      case 'PAYMENT_REQUIRED':
        return 402;
      case 'FORBIDDEN':
        return 403;
      case 'CONFLICT':
        return 409;
      case 'RATE_LIMIT_ERROR':
        return 429;
      default:
        return 500;
    }
  }
}

export interface ApiResponse<T> {
  data?: T;
  error?: ErrorMetadata;
}

export interface ErrorReport extends ErrorMetadata {
  timestamp: string;
  environment: string;
  request?: {
    method?: string;
    path?: string;
    params?: any;
    query?: any;
    body?: any;
  };
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
}; 