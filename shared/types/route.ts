import type { Request, Response, NextFunction } from 'express';
import type { ValidationSchema } from './validation';
import type { UserRole } from './auth';

/**
 * Route handler type
 */
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Route middleware type
 */
export type RouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Route error type
 */
export interface RouteError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

/**
 * Route error factory type
 */
export type RouteErrorFactory = (message: string, details?: unknown) => RouteError;

/**
 * Route configuration
 */
export interface RouteConfig {
  /**
   * Route path
   */
  path: string;

  /**
   * HTTP method
   */
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';

  /**
   * Route handler
   */
  handler: RouteHandler;

  /**
   * Route middleware
   */
  middleware?: RouteMiddleware[];

  /**
   * Required roles
   */
  roles?: UserRole[];

  /**
   * Validation schema
   */
  validation?: {
    body?: ValidationSchema;
    query?: ValidationSchema;
    params?: ValidationSchema;
  };

  /**
   * Rate limit options
   */
  rateLimit?: {
    windowMs?: number;
    max?: number;
  };

  /**
   * Cache options
   */
  cache?: {
    ttl?: number;
    key?: string;
  };
}

/**
 * Route group configuration
 */
export interface RouteGroupConfig {
  /**
   * Base path
   */
  basePath: string;

  /**
   * Routes
   */
  routes: RouteConfig[];

  /**
   * Group middleware
   */
  middleware?: RouteMiddleware[];

  /**
   * Required roles for all routes
   */
  roles?: UserRole[];

  /**
   * Rate limit options for all routes
   */
  rateLimit?: {
    windowMs?: number;
    max?: number;
  };

  /**
   * Cache options for all routes
   */
  cache?: {
    ttl?: number;
    prefix?: string;
  };
}

/**
 * Route builder configuration
 */
export interface RouteBuilderConfig {
  /**
   * Route groups
   */
  groups: RouteGroupConfig[];

  /**
   * Global middleware
   */
  middleware?: RouteMiddleware[];

  /**
   * Error handlers
   */
  errorHandlers?: RouteMiddleware[];

  /**
   * Not found handler
   */
  notFoundHandler?: RouteHandler;
}
