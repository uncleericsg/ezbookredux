import type {
  RouteBuilder,
  RouteConfig,
  RouteHandler,
  HttpMethod,
  RouteRequest
} from '@shared/types/route';
import type { Request, Response } from 'express';
import type { UserRole } from '@shared/types/auth';
import type { ValidationSchema } from '@shared/types/validation';

/**
 * Route builder implementation
 */
export class RouteBuilderImpl<TRequest extends Request = Request, TResponse = any>
  implements RouteBuilder<TRequest, TResponse>
{
  private config: Partial<RouteConfig<TRequest, TResponse>> = {};

  /**
   * Set HTTP method
   */
  method(method: HttpMethod): RouteBuilder<TRequest, TResponse> {
    this.config.method = method;
    return this;
  }

  /**
   * Set route path
   */
  path(path: string): RouteBuilder<TRequest, TResponse> {
    this.config.path = path;
    return this;
  }

  /**
   * Set route handler
   */
  handler(handler: RouteHandler<TRequest, TResponse>): RouteBuilder<TRequest, TResponse> {
    this.config.handler = handler;
    return this;
  }

  /**
   * Require authentication
   */
  auth(required = true): RouteBuilder<TRequest, TResponse> {
    this.config.auth = required;
    return this;
  }

  /**
   * Require roles
   */
  roles(roles: UserRole[]): RouteBuilder<TRequest, TResponse> {
    this.config.roles = roles;
    return this;
  }

  /**
   * Add request validation
   */
  validation(schema: {
    body?: ValidationSchema;
    query?: ValidationSchema;
    params?: ValidationSchema;
  }): RouteBuilder<TRequest, TResponse> {
    this.config.validation = schema;
    return this;
  }

  /**
   * Add rate limiting
   */
  rateLimit(config: { windowMs: number; max: number }): RouteBuilder<TRequest, TResponse> {
    this.config.rateLimit = config;
    return this;
  }

  /**
   * Add caching
   */
  cache(config: {
    ttl: number;
    key?: string | ((req: TRequest) => string);
  }): RouteBuilder<TRequest, TResponse> {
    this.config.cache = config;
    return this;
  }

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
  }): RouteBuilder<TRequest, TResponse> {
    this.config.cors = config;
    return this;
  }

  /**
   * Add compression
   */
  compression(enabled = true): RouteBuilder<TRequest, TResponse> {
    this.config.compression = enabled;
    return this;
  }

  /**
   * Set request timeout
   */
  timeout(ms: number): RouteBuilder<TRequest, TResponse> {
    this.config.timeout = ms;
    return this;
  }

  /**
   * Set body size limit
   */
  bodyLimit(limit: string | number): RouteBuilder<TRequest, TResponse> {
    this.config.bodyLimit = limit;
    return this;
  }

  /**
   * Add custom middleware
   */
  use(middleware: Array<(req: TRequest, res: Response) => Promise<void>>): RouteBuilder<TRequest, TResponse> {
    this.config.middleware = middleware;
    return this;
  }

  /**
   * Build route configuration
   */
  build(): RouteConfig<TRequest, TResponse> {
    if (!this.config.method) {
      throw new Error('Route method is required');
    }
    if (!this.config.path) {
      throw new Error('Route path is required');
    }
    if (!this.config.handler) {
      throw new Error('Route handler is required');
    }

    return this.config as RouteConfig<TRequest, TResponse>;
  }
}

/**
 * Create route builder
 */
export function createRouteBuilder<TRequest extends Request = Request, TResponse = any>(): RouteBuilder<TRequest, TResponse> {
  return new RouteBuilderImpl<TRequest, TResponse>();
}

/**
 * Create route configuration
 */
export function createRouteConfig<TRequest extends Request = Request, TResponse = any>(
  config: Partial<RouteConfig<TRequest, TResponse>>
): RouteConfig<TRequest, TResponse> {
  const builder = new RouteBuilderImpl<TRequest, TResponse>();

  if (config.method) {
    builder.method(config.method);
  }
  if (config.path) {
    builder.path(config.path);
  }
  if (config.handler) {
    builder.handler(config.handler);
  }
  if (config.auth) {
    builder.auth(config.auth);
  }
  if (config.roles) {
    builder.roles(config.roles);
  }
  if (config.validation) {
    builder.validation(config.validation);
  }
  if (config.rateLimit) {
    builder.rateLimit(config.rateLimit);
  }
  if (config.cache) {
    builder.cache(config.cache);
  }
  if (config.cors) {
    builder.cors(config.cors);
  }
  if (config.compression) {
    builder.compression(config.compression);
  }
  if (config.timeout) {
    builder.timeout(config.timeout);
  }
  if (config.bodyLimit) {
    builder.bodyLimit(config.bodyLimit);
  }
  if (config.middleware) {
    builder.use(config.middleware);
  }

  return builder.build();
}

/**
 * Route builder factory
 */
export const routeBuilder = {
  create: createRouteBuilder,
  createConfig: createRouteConfig
};
