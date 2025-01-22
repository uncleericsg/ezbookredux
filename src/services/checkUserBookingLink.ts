import { supabaseClient } from '@/config/supabase/client';
import * as dotenv from 'dotenv';
import type { User } from '@/types/user';

// Load environment variables
dotenv.config();

interface AlterTableResult {
  success: boolean;
  message?: string;
}

async function checkUserBookingLink() {
  try {
    // Check users table structure
    const { data: userColumns, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .limit(1);

    if (userError) {
      console.error('Error checking users table:', userError);
      return;
    }

    console.log('Users table structure:', Object.keys(userColumns?.[0] || {}));

    // Check if we need to add user_id to bookings table
    const { error: alterError } = await supabaseClient.rpc('alter_bookings_table', {
      sql_command: `
        -- Add user_id to bookings if it doesn't exist
        ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

        -- Create index on user_id
        CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
      `
    });

    if (alterError) {
      console.log('Please run this SQL in your Supabase dashboard:');
      console.log(`
        -- Add user_id to bookings if it doesn't exist
        ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

        -- Create index on user_id
        CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
      `);
      return;
    }

    console.log('Successfully linked bookings to users table!');
  } catch (error) {
    console.error('Error checking user-booking link:', error);
  }
}

// Run the check
checkUserBookingLink();
