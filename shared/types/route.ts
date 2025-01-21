import type { Request, Response } from 'express';
import type { ValidationSchema } from './validation';
import type { UserRole } from './auth';

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Route handler type
 */
export type RouteHandler<TRequest extends Request = Request, TResponse = any> = (
  req: TRequest,
  res: Response
) => Promise<TResponse>;

/**
 * Route configuration
 */
export interface RouteConfig<TRequest extends Request = Request, TResponse = any> {
  /**
   * HTTP method
   */
  method: HttpMethod;

  /**
   * Route path
   */
  path: string;

  /**
   * Route handler
   */
  handler: RouteHandler<TRequest, TResponse>;

  /**
   * Authentication required
   */
  auth?: boolean;

  /**
   * Required roles
   */
  roles?: UserRole[];

  /**
   * Request validation schema
   */
  validation?: {
    body?: ValidationSchema;
    query?: ValidationSchema;
    params?: ValidationSchema;
  };

  /**
   * Rate limiting configuration
   */
  rateLimit?: {
    windowMs: number;
    max: number;
  };

  /**
   * Cache configuration
   */
  cache?: {
    ttl: number;
    key?: string | ((req: TRequest) => string);
  };

  /**
   * CORS configuration
   */
  cors?: {
    origin?: string | string[] | boolean;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  };

  /**
   * Compression configuration
   */
  compression?: boolean;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Request body size limit
   */
  bodyLimit?: string | number;

  /**
   * Custom middleware
   */
  middleware?: Array<(req: TRequest, res: Response) => Promise<void>>;
}

/**
 * Route builder
 */
export interface RouteBuilder<TRequest extends Request = Request, TResponse = any> {
  /**
   * Set HTTP method
   */
  method(method: HttpMethod): RouteBuilder<TRequest, TResponse>;

  /**
   * Set route path
   */
  path(path: string): RouteBuilder<TRequest, TResponse>;

  /**
   * Set route handler
   */
  handler(handler: RouteHandler<TRequest, TResponse>): RouteBuilder<TRequest, TResponse>;

  /**
   * Require authentication
   */
  auth(required?: boolean): RouteBuilder<TRequest, TResponse>;

  /**
   * Require roles
   */
  roles(roles: UserRole[]): RouteBuilder<TRequest, TResponse>;

  /**
   * Add request validation
   */
  validation(schema: {
    body?: ValidationSchema;
    query?: ValidationSchema;
    params?: ValidationSchema;
  }): RouteBuilder<TRequest, TResponse>;

  /**
   * Add rate limiting
   */
  rateLimit(config: { windowMs: number; max: number }): RouteBuilder<TRequest, TResponse>;

  /**
   * Add caching
   */
  cache(config: {
    ttl: number;
    key?: string | ((req: TRequest) => string);
  }): RouteBuilder<TRequest, TResponse>;

  /**
   * Add CORS
   */
  cors(config: {
    origin?: string | string[] | boolean;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  }): RouteBuilder<TRequest, TResponse>;

  /**
   * Add compression
   */
  compression(enabled?: boolean): RouteBuilder<TRequest, TResponse>;

  /**
   * Set request timeout
   */
  timeout(ms: number): RouteBuilder<TRequest, TResponse>;

  /**
   * Set body size limit
   */
  bodyLimit(limit: string | number): RouteBuilder<TRequest, TResponse>;

  /**
   * Add custom middleware
   */
  use(middleware: Array<(req: TRequest, res: Response) => Promise<void>>): RouteBuilder<TRequest, TResponse>;

  /**
   * Build route configuration
   */
  build(): RouteConfig<TRequest, TResponse>;
}

/**
 * Route factory
 */
export interface RouteFactory {
  /**
   * Create route builder
   */
  create<TRequest extends Request = Request, TResponse = any>(): RouteBuilder<TRequest, TResponse>;

  /**
   * Create route configuration
   */
  createConfig<TRequest extends Request = Request, TResponse = any>(
    config: Partial<RouteConfig<TRequest, TResponse>>
  ): RouteConfig<TRequest, TResponse>;
}

/**
 * Route error
 */
export interface RouteError extends Error {
  code: string;
  statusCode: number;
  details?: any;
}

/**
 * Route error factory
 */
export interface RouteErrorFactory {
  /**
   * Create route error
   */
  create(message: string, code: string, statusCode?: number, details?: any): RouteError;

  /**
   * Create bad request error
   */
  badRequest(message: string, code?: string, details?: any): RouteError;

  /**
   * Create unauthorized error
   */
  unauthorized(message: string, code?: string, details?: any): RouteError;

  /**
   * Create forbidden error
   */
  forbidden(message: string, code?: string, details?: any): RouteError;

  /**
   * Create not found error
   */
  notFound(message: string, code?: string, details?: any): RouteError;

  /**
   * Create conflict error
   */
  conflict(message: string, code?: string, details?: any): RouteError;

  /**
   * Create validation error
   */
  validation(message: string, code?: string, details?: any): RouteError;

  /**
   * Create internal server error
   */
  internal(message: string, code?: string, details?: any): RouteError;
}

/**
 * Route response
 */
export interface RouteResponse<T = any> {
  /**
   * Response data
   */
  data?: T;

  /**
   * Response metadata
   */
  meta?: {
    /**
     * Total count
     */
    total?: number;

    /**
     * Page number
     */
    page?: number;

    /**
     * Page size
     */
    limit?: number;

    /**
     * Additional metadata
     */
    [key: string]: any;
  };

  /**
   * Response error
   */
  error?: {
    /**
     * Error code
     */
    code: string;

    /**
     * Error message
     */
    message: string;

    /**
     * Error details
     */
    details?: any;
  };
}

/**
 * Route request
 */
export interface RouteRequest<T = any> extends Request {
  /**
   * Request body
   */
  body: T;

  /**
   * Request query parameters
   */
  query: Record<string, string | string[] | undefined>;

  /**
   * Request URL parameters
   */
  params: Record<string, string>;
}
