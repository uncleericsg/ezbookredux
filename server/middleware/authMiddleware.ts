import type { Request, Response, NextFunction } from 'express';
import type {
  AuthMiddlewareOptions,
  AuthHandler,
  AuthService,
  UserProfile
} from '@shared/types/auth';
import { AuthError } from '@shared/types/auth';
import { logger } from '@server/utils/logger';

/**
 * Default authentication strategies
 */
const DEFAULT_STRATEGIES = ['jwt', 'api-key', 'session'];

/**
 * Default excluded paths
 */
const DEFAULT_EXCLUDED_PATHS = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/verify-phone'
];

/**
 * Create authentication middleware
 */
export function createAuthMiddleware(
  authService: AuthService,
  options: AuthMiddlewareOptions = {}
): AuthHandler {
  const {
    roles,
    optional = false,
    strategies = DEFAULT_STRATEGIES,
    excludePaths = DEFAULT_EXCLUDED_PATHS,
    roleBasedPaths = {},
    config,
    onError
  } = options;

  /**
   * Authentication middleware
   */
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip authentication for excluded paths
      if (excludePaths.some(path => req.path.startsWith(path))) {
        return next();
      }

      // Check role-based path restrictions
      const requiredRoles = Object.entries(roleBasedPaths).find(([path]) =>
        req.path.startsWith(path)
      )?.[1];

      // Try each strategy in order
      let user: UserProfile | null = null;
      let error: Error | null = null;

      for (const strategy of strategies) {
        try {
          switch (strategy) {
            case 'jwt':
              if (!req.headers.authorization?.startsWith('Bearer ')) {
                continue;
              }
              const token = req.headers.authorization.split(' ')[1];
              user = await authService.verifyToken(token);
              break;

            case 'api-key':
              const apiKey =
                req.headers['x-api-key'] ||
                req.query.apiKey ||
                req.cookies?.apiKey;
              if (!apiKey) {
                continue;
              }
              user = await authService.verifyApiKey(apiKey as string);
              break;

            case 'session':
              const sessionId = req.cookies?.sessionId;
              if (!sessionId) {
                continue;
              }
              user = await authService.verifySession(sessionId);
              break;

            default:
              logger.warn('Unknown authentication strategy', { strategy });
              continue;
          }

          // Strategy succeeded
          break;
        } catch (e) {
          error = e as Error;
          continue;
        }
      }

      // Handle authentication failure
      if (!user) {
        if (optional) {
          return next();
        }

        const authError = new AuthError(
          'Authentication required',
          'AUTH_REQUIRED',
          401,
          { originalError: error }
        );

        if (onError) {
          return onError(authError, req, res);
        }

        throw authError;
      }

      // Check role requirements
      if (roles?.length && !roles.includes(user.role)) {
        const authError = new AuthError(
          'Insufficient permissions',
          'INSUFFICIENT_PERMISSIONS',
          403,
          { originalError: error }
        );

        if (onError) {
          return onError(authError, req, res);
        }

        throw authError;
      }

      // Check path-specific role requirements
      if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
        const authError = new AuthError(
          'Insufficient permissions for this path',
          'INSUFFICIENT_PERMISSIONS',
          403,
          { originalError: error }
        );

        if (onError) {
          return onError(authError, req, res);
        }

        throw authError;
      }

      // Attach user to request
      (req as any).user = user;

      next();
    } catch (error) {
      if (onError) {
        return onError(error as AuthError, req, res);
      }

      next(error);
    }
  };
}
