import type { Request, Response, NextFunction } from 'express';
import type { ErrorCode } from './error';
import type { UserRole } from './auth';

/**
 * API error response
 */
export interface ApiErrorResponse {
  code: ErrorCode;
  message: string;
  details?: unknown;
}

/**
 * API success response
 */
export interface ApiSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * API response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Authenticated request
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
  };
}

/**
 * Request handler
 */
export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Authenticated request handler
 */
export type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Error handler
 */
export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

/**
 * Middleware configuration
 */
export interface MiddlewareConfig {
  /**
   * CORS options
   */
  cors?: {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  };

  /**
   * Rate limit options
   */
  rateLimit?: {
    windowMs?: number;
    max?: number;
    message?: string;
    statusCode?: number;
    headers?: boolean;
    keyGenerator?: (req: Request) => string;
  };

  /**
   * Body parser options
   */
  bodyParser?: {
    json?: {
      limit?: string | number;
      strict?: boolean;
      type?: string | string[];
    };
    urlencoded?: {
      extended?: boolean;
      limit?: string | number;
      parameterLimit?: number;
    };
  };

  /**
   * Compression options
   */
  compression?: {
    level?: number;
    threshold?: number | string;
    filter?: (req: Request, res: Response) => boolean;
  };

  /**
   * Static file options
   */
  static?: {
    root?: string;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    etag?: boolean;
    extensions?: string[];
    fallthrough?: boolean;
    immutable?: boolean;
    index?: boolean | string | string[];
    lastModified?: boolean;
    maxAge?: number | string;
    redirect?: boolean;
    setHeaders?: (res: Response, path: string, stat: any) => void;
  };
}
