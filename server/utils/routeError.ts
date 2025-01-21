import type { RouteError, RouteErrorFactory } from '@shared/types/route';

/**
 * Route error implementation
 */
export class RouteErrorImpl extends Error implements RouteError {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'RouteError';
  }
}

/**
 * Create route error
 */
function create(
  message: string,
  code: string,
  statusCode?: number,
  details?: any
): RouteError {
  return new RouteErrorImpl(message, code, statusCode, details);
}

/**
 * Create bad request error
 */
function badRequest(
  message: string,
  code = 'BAD_REQUEST',
  details?: any
): RouteError {
  return create(message, code, 400, details);
}

/**
 * Create unauthorized error
 */
function unauthorized(
  message: string,
  code = 'UNAUTHORIZED',
  details?: any
): RouteError {
  return create(message, code, 401, details);
}

/**
 * Create forbidden error
 */
function forbidden(
  message: string,
  code = 'FORBIDDEN',
  details?: any
): RouteError {
  return create(message, code, 403, details);
}

/**
 * Create not found error
 */
function notFound(
  message: string,
  code = 'NOT_FOUND',
  details?: any
): RouteError {
  return create(message, code, 404, details);
}

/**
 * Create conflict error
 */
function conflict(
  message: string,
  code = 'CONFLICT',
  details?: any
): RouteError {
  return create(message, code, 409, details);
}

/**
 * Create validation error
 */
function validation(
  message: string,
  code = 'VALIDATION_ERROR',
  details?: any
): RouteError {
  return create(message, code, 422, details);
}

/**
 * Create internal server error
 */
function internal(
  message: string,
  code = 'INTERNAL_SERVER_ERROR',
  details?: any
): RouteError {
  return create(message, code, 500, details);
}

/**
 * Route error factory
 */
export const routeError: RouteErrorFactory = {
  create,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  validation,
  internal
};
