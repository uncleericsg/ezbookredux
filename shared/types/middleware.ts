import type { Request, Response, NextFunction } from 'express';
import type { CorsOptions } from 'cors';
import type { HelmetOptions } from 'helmet';
import type { ValidationSchema } from './validation';
import type { UserProfile } from './auth';

/**
 * Rate limit options
 */
export interface RateLimitOptions {
  /**
   * Max number of requests during windowMs
   */
  max?: number;

  /**
   * Time window in milliseconds
   */
  windowMs?: number;

  /**
   * Error message sent to user when max is exceeded
   */
  message?: string;

  /**
   * Status code returned when max is exceeded
   */
  statusCode?: number;

  /**
   * Enable headers for request limit info
   */
  headers?: boolean;

  /**
   * Allow client to override limit per key
   */
  skipFailedRequests?: boolean;

  /**
   * Function to generate custom keys
   */
  keyGenerator?: (req: Request) => string;

  /**
   * Function to skip requests
   */
  skip?: (req: Request) => boolean;

  /**
   * Function to handle exceeded requests
   */
  handler?: (req: Request, res: Response) => void;
}

/**
 * Middleware handler type
 */
export type MiddlewareHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * CORS middleware configuration
 */
export type CorsMiddlewareConfig = CorsOptions;

/**
 * Helmet middleware configuration
 */
export type HelmetMiddlewareConfig = HelmetOptions;

/**
 * Rate limit middleware configuration
 */
export type RateLimitMiddlewareConfig = RateLimitOptions;

/**
 * Error handling middleware configuration
 */
export interface ErrorHandlingMiddlewareConfig {
  /**
   * Log errors
   */
  logErrors?: boolean;

  /**
   * Include stack trace in error response
   */
  includeStackTrace?: boolean;

  /**
   * Default error status code
   */
  defaultStatusCode?: number;

  /**
   * Default error message
   */
  defaultMessage?: string;

  /**
   * Error handlers by type
   */
  handlers?: Record<string, (error: Error) => {
    code: string;
    message: string;
    statusCode: number;
    details?: unknown;
  }>;
}

/**
 * Validation middleware configuration
 */
export interface ValidationMiddlewareConfig {
  /**
   * Validation schemas by route
   */
  schemas: Record<string, ValidationSchema>;

  /**
   * Strip unknown properties
   */
  stripUnknown?: boolean;

  /**
   * Allow unknown properties
   */
  allowUnknown?: boolean;

  /**
   * Convert types
   */
  convert?: boolean;

  /**
   * Abort early on first error
   */
  abortEarly?: boolean;
}

/**
 * Authentication middleware configuration
 */
export interface AuthMiddlewareConfig {
  /**
   * Required roles
   */
  roles?: string[];

  /**
   * Optional authentication
   */
  optional?: boolean;

  /**
   * Authentication strategies to try
   */
  strategies?: string[];

  /**
   * Custom error handler
   */
  onError?: (error: Error, req: Request, res: Response) => Promise<void>;

  /**
   * Strategy configuration
   */
  config?: Record<string, unknown>;

  /**
   * Excluded paths
   */
  excludePaths?: string[];

  /**
   * Role-based path restrictions
   */
  roleBasedPaths?: Record<string, string[]>;
}

/**
 * Static file serving middleware configuration
 */
export interface StaticMiddlewareConfig {
  /**
   * Root directory
   */
  root: string;

  /**
   * URL path
   */
  path?: string;

  /**
   * Cache control max age
   */
  maxAge?: number;

  /**
   * Enable etag
   */
  etag?: boolean;

  /**
   * Enable directory listing
   */
  index?: boolean;

  /**
   * Enable dotfiles
   */
  dotfiles?: 'allow' | 'deny' | 'ignore';

  /**
   * Enable fallthrough
   */
  fallthrough?: boolean;

  /**
   * Enable immutable caching
   */
  immutable?: boolean;

  /**
   * Enable last modified
   */
  lastModified?: boolean;

  /**
   * Enable redirect
   */
  redirect?: boolean;

  /**
   * Set headers
   */
  setHeaders?: (res: Response, path: string, stat: any) => void;
}

/**
 * Middleware configuration
 */
export interface MiddlewareConfig {
  /**
   * CORS configuration
   */
  cors?: CorsMiddlewareConfig;

  /**
   * Helmet configuration
   */
  helmet?: HelmetMiddlewareConfig;

  /**
   * Rate limit configuration
   */
  rateLimit?: RateLimitMiddlewareConfig;

  /**
   * Error handling configuration
   */
  errorHandling?: ErrorHandlingMiddlewareConfig;

  /**
   * Validation configuration
   */
  validation?: ValidationMiddlewareConfig;

  /**
   * Authentication configuration
   */
  auth?: AuthMiddlewareConfig;

  /**
   * Static file serving configuration
   */
  static?: StaticMiddlewareConfig;
}

// Re-export UserProfile for use in other modules
export { UserProfile };
