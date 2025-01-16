export type ApiErrorCode = 
  | 'NETWORK_ERROR'           // Network connectivity issues
  | 'SERVICE_ERROR'           // Generic service errors
  | 'UNAUTHORIZED'            // Authentication failures
  | 'VALIDATION_ERROR'        // Input validation failures
  | 'NOT_FOUND'              // Resource not found
  | 'FORBIDDEN'              // Permission denied
  | 'CONFLICT'               // Resource conflict
  | 'RATE_LIMIT_EXCEEDED'    // API rate limit exceeded
  | 'BAD_REQUEST'            // Invalid request
  | 'INTERNAL_SERVER_ERROR'  // Server-side errors
  | 'SERVICE_UNAVAILABLE';   // Service temporarily unavailable

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
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