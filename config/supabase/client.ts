import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

export const getServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key');
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};