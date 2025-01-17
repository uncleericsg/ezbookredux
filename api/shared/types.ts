import type { NextApiRequest } from 'next';
import type { Database } from '@/server/config/supabase/types';

type User = Database['public']['Tables']['users']['Row'];

export interface AuthenticatedRequest extends NextApiRequest {
  user: User;
} 