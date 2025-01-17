import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseClient } from '@/server/config/supabase/client';
import { createApiError } from '@/server/utils/apiResponse';
import type { AuthenticatedRequest } from './types';

// Add shared middleware for common validations
export const validateMethod = (method: string) => (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  if (req.method !== method) {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED'
      }
    });
  }
  next();
};

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
  requiredRoles?: ('admin' | 'service_provider' | 'customer')[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json(
          createApiError('Missing authorization header', 'AUTH_REQUIRED')
        );
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json(
          createApiError('Invalid authentication token', 'AUTH_INVALID')
        );
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return res.status(401).json(
          createApiError('User profile not found', 'AUTH_INVALID')
        );
      }

      // Check role if required
      if (requiredRoles && !requiredRoles.includes(profile.role)) {
        return res.status(403).json(
          createApiError('Insufficient permissions', 'AUTH_INVALID')
        );
      }

      // Add user to request
      (req as AuthenticatedRequest).user = profile;

      // Call the handler
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json(
        createApiError('Authentication failed', 'SERVER_ERROR')
      );
    }
  };
} 