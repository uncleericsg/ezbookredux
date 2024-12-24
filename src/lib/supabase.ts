import { createClient } from '@supabase/supabase-js';

// Client-side only
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Client-side environment variables missing:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'defined' : 'undefined',
    VITE_SUPABASE_ANON_KEY: supabaseKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables in browser');
}

// Initialize client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
