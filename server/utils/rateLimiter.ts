import rateLimit from 'express-rate-limit';
import { ApiError } from './apiErrors';
import { logger } from './logger';

export interface RateLimitConfig {
  windowMs?: number;
  max?: number;
  message?: string;
  statusCode?: number;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  statusCode: 429,
  skipFailedRequests: false,
  skipSuccessfulRequests: false
};

export function createRateLimiter(config: RateLimitConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return rateLimit({
    windowMs: finalConfig.windowMs!,
    max: finalConfig.max!,
    message: {
      error: {
        message: finalConfig.message!,
        code: 'RATE_LIMIT_EXCEEDED',
        statusCode: finalConfig.statusCode!
      }
    },
    statusCode: finalConfig.statusCode!,
    skipFailedRequests: finalConfig.skipFailedRequests,
    skipSuccessfulRequests: finalConfig.skipSuccessfulRequests,
    keyGenerator: finalConfig.keyGenerator || ((req) => req.ip),
    handler: (req, res) => {
      const error = new ApiError(
        finalConfig.message!,
        'RATE_LIMIT_EXCEEDED'
      );

      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        headers: req.headers
      });

      res.status(finalConfig.statusCode!).json(error.toJSON());
    }
  });
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
  // Strict rate limiter for authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true // Don't count successful logins
  }),

  // Rate limiter for API endpoints
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many API requests, please try again later'
  }),

  // Rate limiter for webhook endpoints
  webhook: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 webhook calls per minute
    message: 'Too many webhook requests, please try again later',
    keyGenerator: (req) => {
      // Use webhook signature or source as key if available
      return req.headers['stripe-signature'] || req.ip;
    }
  }),

  // Rate limiter for public endpoints
  public: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: 'Too many requests, please try again later'
  })
}; 