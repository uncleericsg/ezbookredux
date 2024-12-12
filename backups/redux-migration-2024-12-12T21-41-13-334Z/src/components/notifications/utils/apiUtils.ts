import { toast } from 'sonner';

export interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error;
  for (let attempt = 0; attempt < (config.maxRetries || 3); attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = Math.min(
        (config.baseDelay || 1000) * Math.pow(2, attempt),
        config.maxDelay || 5000
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError!;
}

// Rate limiting using token bucket algorithm
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;

  constructor(maxTokens: number, refillRate: number) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  async tryAcquire(): Promise<boolean> {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const newTokens = (timePassed * this.refillRate) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
    this.lastRefill = now;
  }
}

export const messageRateLimiter = new RateLimiter(5, 1); // 5 messages per second

export function validateBusinessHours(date: Date): boolean {
  const hours = date.getHours();
  const day = date.getDay();
  
  // Assuming business hours are 9 AM to 6 PM, Monday to Saturday
  const isBusinessHour = hours >= 9 && hours < 18;
  const isBusinessDay = day >= 1 && day <= 6;
  
  return isBusinessHour && isBusinessDay;
}

export function validateFutureDate(date: Date): boolean {
  const now = new Date();
  return date > now;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
