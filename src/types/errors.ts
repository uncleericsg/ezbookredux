export type ApiErrorCode =
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'PAYMENT_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMIT_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'FIREBASE_AUTH_ERROR'
  | 'FIREBASE_DB_ERROR'
  | 'STRIPE_ERROR'
  | 'MAPS_ERROR'
  | 'PRICING_ERROR'
  | 'SERVICE_ERROR'
  | 'PAYMENT_ERROR'
  | 'SERVICE_INIT_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface ErrorReport {
  message: string;
  code: ApiErrorCode;
  stack?: string;
  timestamp: string;
  environment: string;
  context?: Record<string, any>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
