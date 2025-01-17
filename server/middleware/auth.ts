import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: AuthUser;
}

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export function verifyAuthToken(token: string): AuthUser {
  try {
    return verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    throw new ApiError(
      'Invalid or expired token',
      'UNAUTHORIZED',
      { originalError: error }
    );
  }
}

export function extractToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  const [bearer, token] = authHeader.split(' ');
  
  if (bearer !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export function requireAuth() {
  return async function authenticate(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: Function
  ) {
    const token = extractToken(req);

    if (!token) {
      throw new ApiError(
        'Authentication token is required',
        'UNAUTHORIZED'
      );
    }

    try {
      req.user = verifyAuthToken(token);
      return next();
    } catch (error) {
      logger.warn('Authentication failed', { error });
      throw error;
    }
  };
}

export function requireRole(allowedRoles: string[]) {
  return async function checkRole(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: Function
  ) {
    if (!req.user) {
      throw new ApiError(
        'User must be authenticated',
        'UNAUTHORIZED'
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        'Insufficient permissions',
        'FORBIDDEN'
      );
    }

    return next();
  };
}

export function requirePermission(requiredPermissions: string[]) {
  return async function checkPermission(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: Function
  ) {
    if (!req.user) {
      throw new ApiError(
        'User must be authenticated',
        'UNAUTHORIZED'
      );
    }

    const userPermissions = req.user.permissions || [];
    const hasAllPermissions = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ApiError(
        'Insufficient permissions',
        'FORBIDDEN'
      );
    }

    return next();
  };
}

export function optionalAuth() {
  return async function authenticateOptional(
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: Function
  ) {
    const token = extractToken(req);

    if (token) {
      try {
        req.user = verifyAuthToken(token);
      } catch (error) {
        logger.warn('Optional authentication failed', { error });
      }
    }

    return next();
  };
}

export const isAuthenticated = (req: AuthenticatedRequest): boolean => {
  return !!req.user;
};

export const hasRole = (req: AuthenticatedRequest, role: string): boolean => {
  return req.user?.role === role;
};

export const hasPermission = (req: AuthenticatedRequest, permission: string): boolean => {
  return req.user?.permissions?.includes(permission) || false;
}; 