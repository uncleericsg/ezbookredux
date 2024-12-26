import { supabase } from '@services/supabase/client';

// Load environment variables
dotenv.config();

async function migrateBookingTable() {
  try {
    // Add new columns
    const { error: alterError } = await supabase.rpc('alter_bookings_table', {
      sql_command: `
        -- Drop existing columns we don't need
        ALTER TABLE bookings DROP COLUMN IF EXISTS scheduled_at;
        ALTER TABLE bookings DROP COLUMN IF EXISTS customer_id;

        -- Add new columns
        ALTER TABLE bookings 
          ADD COLUMN IF NOT EXISTS customer_info JSONB,
          ADD COLUMN IF NOT EXISTS service_title VARCHAR,
          ADD COLUMN IF NOT EXISTS service_price DECIMAL(10,2),
          ADD COLUMN IF NOT EXISTS service_duration VARCHAR,
          ADD COLUMN IF NOT EXISTS service_description TEXT,
          ADD COLUMN IF NOT EXISTS brands VARCHAR[],
          ADD COLUMN IF NOT EXISTS issues VARCHAR[],
          ADD COLUMN IF NOT EXISTS other_issue TEXT,
          ADD COLUMN IF NOT EXISTS is_amc BOOLEAN DEFAULT FALSE,
          ADD COLUMN IF NOT EXISTS scheduled_datetime TIMESTAMP WITH TIME ZONE,
          ADD COLUMN IF NOT EXISTS scheduled_timeslot VARCHAR,
          ADD COLUMN IF NOT EXISTS payment_status VARCHAR,
          ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR,
          ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
          ADD COLUMN IF NOT EXISTS tip_amount DECIMAL(10,2) DEFAULT 0,
          ADD COLUMN IF NOT EXISTS metadata JSONB;

        -- Add constraints
        ALTER TABLE bookings 
          ADD CONSTRAINT valid_customer_info 
          CHECK (
            customer_info ? 'first_name' AND
            customer_info ? 'last_name' AND
            customer_info ? 'email' AND
            customer_info ? 'mobile' AND
            customer_info ? 'floor_unit' AND
            customer_info ? 'block_street' AND
            customer_info ? 'postal_code'
          );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings ((customer_info->>'email'));
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
        CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_datetime ON bookings (scheduled_datetime);
        CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status);
      `
    });

    if (alterError) {
      console.error('Error altering table:', alterError);
      return;
    }

    console.log('Successfully migrated bookings table');

  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run the migration
migrateBookingTable();
