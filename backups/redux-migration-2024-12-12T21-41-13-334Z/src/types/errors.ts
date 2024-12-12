// Base error class for all location-related errors
export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationError';
  }
}

// Specific error types
export class RegionNotFoundError extends LocationError {
  constructor(address: string) {
    super(`Unable to determine region for address: ${address}`);
    this.name = 'RegionNotFoundError';
  }
}

export class OptimizationError extends LocationError {
  constructor(message: string, public readonly retryable: boolean = true) {
    super(message);
    this.name = 'OptimizationError';
  }
}

export class RateLimitError extends LocationError {
  constructor(public readonly retryAfter: number) {
    super(`Rate limit exceeded. Please try again in ${retryAfter} seconds`);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends LocationError {
  constructor(public readonly offline: boolean = false) {
    super(offline ? 'No internet connection' : 'Network request failed');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends LocationError {
  constructor(public readonly validationErrors: string[]) {
    super('Validation failed: ' + validationErrors.join(', '));
    this.name = 'ValidationError';
  }
}

// Error type guards
export const isLocationError = (error: unknown): error is LocationError => {
  return error instanceof LocationError;
};

export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return error instanceof RateLimitError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof OptimizationError) {
    return error.retryable;
  }
  if (error instanceof NetworkError) {
    return !error.offline;
  }
  if (error instanceof RateLimitError) {
    return true;
  }
  return false;
};
