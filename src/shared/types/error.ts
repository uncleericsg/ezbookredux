/**
 * Error codes for the application
 */
export type ErrorCode =
  // Generic errors
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  
  // Admin settings errors
  | 'FETCH_ADMIN_SETTINGS_ERROR'
  | 'UPDATE_ADMIN_SETTINGS_ERROR'
  | 'UPDATE_BRANDING_ERROR'
  | 'RESET_ADMIN_SETTINGS_ERROR'
  
  // Authentication errors
  | 'AUTH_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'SESSION_EXPIRED'
  
  // Payment errors
  | 'PAYMENT_FAILED'
  | 'INVALID_PAYMENT'
  | 'STRIPE_ERROR'
  
  // Booking errors
  | 'BOOKING_ERROR'
  | 'INVALID_BOOKING'
  | 'BOOKING_CONFLICT'
  
  // Service errors
  | 'SERVICE_ERROR'
  | 'INVALID_SERVICE'
  | 'SERVICE_UNAVAILABLE';

/**
 * Base error type for the application
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Error response type for API endpoints
 */
export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}