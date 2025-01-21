import type { Request, Response, NextFunction } from 'express';
import { supabaseClient } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type { 
  AuthenticatedRequest,
  MiddlewareFunction,
  UserRole,
  UserProfile
} from '@shared/types/middleware';

/**
 * Validates HTTP method for the request
 */
export const validateMethod = (method: string): MiddlewareFunction => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method !== method) {
    throw new ApiError('Method not allowed', 'FORBIDDEN');
  }
  next();
};

/**
 * Authentication middleware that validates user token and role
 */
export function withAuth(requiredRoles?: UserRole[]): MiddlewareFunction {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new ApiError('Missing authorization header', 'UNAUTHORIZED');
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

      if (authError || !user) {
        throw new ApiError('Invalid authentication token', 'UNAUTHORIZED');
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id, email, role, firstName, lastName, phone, created_at, updated_at')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new ApiError('User profile not found', 'UNAUTHORIZED');
      }

      // Check role if required
      if (requiredRoles && !requiredRoles.includes(profile.role)) {
        throw new ApiError('Insufficient permissions', 'FORBIDDEN');
      }

      // Transform and add user to request
      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email,
        role: profile.role as UserRole,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      };

      // Type assertion to handle property assignment
      (req as AuthenticatedRequest).user = userProfile;

      // Continue to next middleware/handler
      next();
    } catch (error) {
      logger.error('Auth middleware error', { error });
      next(error);
    }
  };
}

/**
 * Higher-order function to wrap route handlers with authentication
 */
export function withAuthHandler<T>(
  handler: (req: AuthenticatedRequest, res: Response) => Promise<T>,
  requiredRoles?: UserRole[]
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Apply auth middleware first
      await new Promise<void>((resolve, reject) => {
        withAuth(requiredRoles)(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Then call the handler with the authenticated request
      await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      next(error);
    }
  };
}
