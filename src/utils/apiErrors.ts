import { toast } from 'sonner';
import { errorReportingService } from '@utils/errorReporting';

export enum ApiErrorCode {
  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Common Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVICE_ERROR = 'SERVICE_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',

  // Integration Errors
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  STRIPE_ERROR = 'STRIPE_ERROR',
  MAPS_ERROR = 'MAPS_ERROR'
}

export interface ApiErrorOptions {
  retryable?: boolean;
  shouldToast?: boolean;
  statusCode?: number;
  retryCount?: number;
  maxRetries?: number;
  context?: string;
}

export class ApiError extends Error {
  public retryable: boolean;
  public shouldToast: boolean;
  public statusCode?: number;
  public retryCount: number;
  public maxRetries: number;
  public context?: string;
  public originalError?: unknown;

  constructor(
    message: string,
    public code: ApiErrorCode,
    options: ApiErrorOptions = {},
    originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.retryable = options.retryable ?? false;
    this.shouldToast = options.shouldToast ?? true;
    this.statusCode = options.statusCode;
    this.retryCount = options.retryCount ?? 0;
    this.maxRetries = options.maxRetries ?? 3;
    this.context = options.context;
    this.originalError = originalError;
  }

  canRetry(): boolean {
    return this.retryable && this.retryCount < this.maxRetries;
  }

  // Firebase Error Handlers
  static fromFirebaseError(error: any, context?: string): ApiError {
    const options: ApiErrorOptions = { context, retryable: true };
    
    if (error.code === 'auth/user-token-expired') {
      return new ApiError(
        'Your session has expired. Please login again.',
        ApiErrorCode.UNAUTHORIZED,
        { ...options, retryable: true }
      );
    }
    
    if (error.code === 'permission-denied') {
      return new ApiError(
        'You don\'t have permission to perform this action',
        ApiErrorCode.FORBIDDEN,
        { ...options, retryable: false }
      );
    }
    
    return new ApiError(
      error.message || 'Firebase operation failed',
      ApiErrorCode.FIREBASE_ERROR,
      options,
      error
    );
  }

  // Stripe Error Handlers
  static fromStripeError(error: any): ApiError {
    const options: ApiErrorOptions = { context: 'Stripe', retryable: false };
    return new ApiError(
      error.message || 'Payment processing failed',
      ApiErrorCode.STRIPE_ERROR,
      options,
      error
    );
  }

  // Google Maps/Places Error Handlers
  static fromMapsError(error: any): ApiError {
    return new ApiError(
      error.message || 'Google Maps operation failed',
      ApiErrorCode.MAPS_ERROR,
      { context: 'Google Maps', retryable: true },
      error
    );
  }
}

// Delay function for retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exponential backoff calculation
const calculateBackoff = (retryCount: number, baseDelay: number = 1000): number => {
  return Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
};

export const handleApiError = async (error: unknown): Promise<void> => {
  if (error instanceof ApiError) {
    // Log to error reporting service
    errorReportingService.reportError(
      error,
      { componentStack: error.context || '' },
      'API'
    );

    // Show toast if needed
    if (error.shouldToast) {
      toast.error(error.message);
    }

    // Handle specific error types
    switch (error.code) {
      case ApiErrorCode.UNAUTHORIZED:
        toast.warning('Please log in to continue');
        break;

      case ApiErrorCode.RATE_LIMIT_ERROR:
        const backoffTime = calculateBackoff(error.retryCount);
        toast.warning(`Rate limited. Retrying in ${backoffTime / 1000} seconds...`);
        await delay(backoffTime);
        break;

      case ApiErrorCode.NETWORK_ERROR:
        if (!navigator.onLine) {
          toast.error('No internet connection. Please check your network.');
        }
        break;
    }
  } else if (error instanceof Error) {
    // Handle unknown errors
    errorReportingService.reportError(
      error,
      { componentStack: 'Unknown Error Context' },
      'Unknown'
    );
    toast.error('An unexpected error occurred');
  }
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const isRetryableError = (error: unknown): boolean => {
  return error instanceof ApiError && error.canRetry();
};

// Utility function to retry an operation
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  context: string,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (error instanceof ApiError) {
        error.retryCount = attempt;
        if (!error.canRetry()) {
          throw error;
        }
        
        const backoffTime = calculateBackoff(attempt);
        await delay(backoffTime);
      }
    }
  }
  
  throw lastError;
};
