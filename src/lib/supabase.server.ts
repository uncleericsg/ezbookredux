import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Server-side environment variables missing:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'defined' : 'undefined',
    VITE_SUPABASE_ANON_KEY: supabaseKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables on server');
}

// Initialize server-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
