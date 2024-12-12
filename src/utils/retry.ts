import { isRetryableError } from './errors';

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, maxAttempts: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  shouldRetry: isRetryableError,
  onRetry: () => {}
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T | null> => {
  const { maxAttempts, delayMs, shouldRetry, onRetry } = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      onRetry(attempt, maxAttempts);
      
      // Exponential backoff
      const backoffTime = delayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      
      attempt++;
    }
  }

  return null;
};