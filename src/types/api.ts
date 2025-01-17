export type ApiErrorCode = 
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'STRIPE_WEBHOOK_ERROR'
  | 'STRIPE_PAYMENT_INTENT_ERROR'
  | 'STRIPE_STATUS_UPDATE_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiRequest<T = any> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    cursor?: string;
  };
}

export interface ErrorReport {
  timestamp: string;
  environment: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  user?: {
    id: string;
    email: string;
  };
}

export interface WebhookResponse {
  received?: boolean;
  error?: {
    message: string;
    code: ApiErrorCode;
    details?: Record<string, unknown>;
  };
} 