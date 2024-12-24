import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCustomersTable() {
  try {
    // First, check if we can query the customers table
    const { data: testData, error: testError } = await supabase
      .from('customers')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('Customers table might not exist:', testError);
      console.log('Please run this SQL in your Supabase dashboard:');
      console.log(`
-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Personal Information
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  mobile VARCHAR NOT NULL UNIQUE,
  
  -- Address Information
  floor_unit VARCHAR,
  block_street VARCHAR,
  postal_code VARCHAR,
  condo_name VARCHAR,
  lobby_tower VARCHAR,
  
  -- Additional Information
  special_instructions TEXT,
  preferred_brands VARCHAR[],
  preferred_timeslots VARCHAR[],
  
  -- Customer Status
  is_active BOOLEAN DEFAULT true,
  last_booking_at TIMESTAMP WITH TIME ZONE,
  total_bookings INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  metadata JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers (mobile);
CREATE INDEX IF NOT EXISTS idx_customers_names ON customers (first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_customers_postal ON customers (postal_code);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customers_updated_at();

-- Modify bookings table to reference customers
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id),
  ADD COLUMN IF NOT EXISTS customer_snapshot JSONB;

-- Create function to update customer statistics
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE customers
    SET 
      total_bookings = total_bookings + 1,
      total_spent = total_spent + NEW.total_amount,
      last_booking_at = NEW.created_at
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_stats_on_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();
      `);
      return;
    }

    // Create a test customer
    const testCustomer = {
      first_name: 'Test',
      last_name: 'Customer',
      email: 'test@example.com',
      mobile: '1234567890',
      floor_unit: '01-01',
      block_street: '123 Test St',
      postal_code: '123456',
      preferred_brands: ['Samsung', 'LG'],
      preferred_timeslots: ['morning', 'afternoon'],
      metadata: {
        source: 'web',
        version: '1.0'
      }
    };

    // Insert test customer
    const { data: customer, error: insertError } = await supabase
      .from('customers')
      .insert([testCustomer])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating test customer:', insertError);
      return;
    }

    console.log('Successfully created test customer:', customer);

    // Clean up test data
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customer.id);

    if (deleteError) {
      console.error('Error cleaning up test customer:', deleteError);
    }

    console.log('Customers table is set up correctly!');
  } catch (error) {
    console.error('Error setting up customers table:', error);
  }
}

// Run the setup
setupCustomersTable();
