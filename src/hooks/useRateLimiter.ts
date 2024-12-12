import { useRef, useCallback } from 'react';
import { RateLimitError } from '../types/errors';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfter?: number;
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

export const useRateLimiter = ({
  maxRequests = 60,
  windowMs = 60000, // 1 minute
  retryAfter = 5000 // 5 seconds
}: RateLimitConfig) => {
  const requests = useRef<RequestRecord[]>([]);
  const lastRetry = useRef<number>(0);

  const cleanup = useCallback(() => {
    const now = Date.now();
    requests.current = requests.current.filter(
      record => now - record.timestamp < windowMs
    );
  }, [windowMs]);

  const checkRateLimit = useCallback(() => {
    cleanup();
    
    const now = Date.now();
    const totalRequests = requests.current.reduce(
      (sum, record) => sum + record.count, 
      0
    );

    if (totalRequests >= maxRequests) {
      const oldestRequest = requests.current[0];
      const timeToWait = (oldestRequest.timestamp + windowMs) - now;
      
      if (now - lastRetry.current < retryAfter) {
        throw new RateLimitError(Math.ceil(retryAfter / 1000));
      }

      lastRetry.current = now;
      throw new RateLimitError(Math.ceil(timeToWait / 1000));
    }

    // Record this request
    const lastRecord = requests.current[requests.current.length - 1];
    if (lastRecord && now - lastRecord.timestamp < 1000) {
      lastRecord.count++;
    } else {
      requests.current.push({ timestamp: now, count: 1 });
    }
  }, [cleanup, maxRequests, windowMs, retryAfter]);

  const withRateLimit = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T
  ): T => {
    return (async (...args: Parameters<T>) => {
      checkRateLimit();
      return await fn(...args);
    }) as T;
  }, [checkRateLimit]);

  const reset = useCallback(() => {
    requests.current = [];
    lastRetry.current = 0;
  }, []);

  return {
    withRateLimit,
    checkRateLimit,
    reset
  };
};
