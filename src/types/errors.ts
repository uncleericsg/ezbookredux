export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'PAYMENT_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'DATABASE_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'INVALID_REQUEST'
  | 'RESOURCE_EXISTS'
  | 'RESOURCE_NOT_FOUND'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FORMAT'
  | 'BOOKING_ERROR'
  | 'PAYMENT_REQUIRED'
  | 'INSUFFICIENT_FUNDS'
  | 'INVALID_PAYMENT_METHOD'
  | 'PAYMENT_DECLINED'
  | 'INVALID_POSTAL_CODE'
  | 'INVALID_PHONE_NUMBER'
  | 'INVALID_EMAIL'
  | 'INVALID_DATE'
  | 'INVALID_TIME'
  | 'SLOT_UNAVAILABLE'
  | 'BOOKING_CONFLICT'
  | 'INVALID_SERVICE'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_ADDRESS'
  | 'GEOCODING_ERROR'
  | 'DISTANCE_ERROR'
  | 'PRICING_ERROR'
  | 'SERVICE_ERROR'
  | 'FIREBASE_ERROR'
  | 'STRIPE_ERROR'
  | 'MAPS_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface ErrorReport {
  timestamp: string;
  environment: string;
  userId?: string;
  sessionId?: string;
  error: ApiError;
  context?: Record<string, any>;
  stackTrace?: string;
}

export interface NetworkError {
  code: string;
  isNetworkError: boolean;
}

// Remove specific error classes and their type guards as they're now handled through the ApiError interface
