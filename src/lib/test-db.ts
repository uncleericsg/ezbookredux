import { supabaseClient } from '@/server/config/supabase/client';

async function testConnection() {
  try {
    const { data, error } = await supabaseClient
      .from('payments')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      return;
    }

    console.log('Connection successful! Sample data:', data);
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();
