import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../config/supabase/client';
import { SUPABASE_CONFIG } from '../config/supabase/constants';

export async function withSupabaseAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  const token = req.cookies[SUPABASE_CONFIG.AUTH.COOKIE_OPTIONS.name];

  if (!token) {
    return res.status(401).json({ error: SUPABASE_CONFIG.ERRORS.AUTH_REQUIRED });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: SUPABASE_CONFIG.ERRORS.INVALID_CREDENTIALS });
    }

    // Attach user to request for downstream handlers
    (req as any).user = user;
    return handler(req, res);
  } catch (error) {
    console.error('Supabase auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 