import { supabase } from './supabase.server';

async function testConnection() {
  try {
    const { data, error } = await supabase
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
