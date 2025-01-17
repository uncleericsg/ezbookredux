import { supabaseClient } from '@/server/config/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

async function checkBookingTable() {
  try {
    // First, get an existing service ID
    const { data: services, error: servicesError } = await supabaseClient
      .from('services')
      .select('id')
      .limit(1)
      .single();

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      return false;
    }

    if (!services) {
      console.error('No services found in the database');
      return false;
    }

    console.log('Found service:', services);

    // Create a test booking with existing service ID
    const testBooking = {
      customer_info: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        mobile: '1234567890',
        floor_unit: '01-01',
        block_street: '123 Test St',
        postal_code: '123456'
      },
      service_id: services.id,
      service_title: 'Test Service',
      service_price: 100.00,
      service_duration: '2h',
      service_description: 'Test description',
      brands: ['Test Brand'],
      issues: ['Test Issue'],
      other_issue: 'Test other issue',
      is_amc: false,
      scheduled_datetime: new Date().toISOString(),
      scheduled_timeslot: '10:00',
      status: 'pending',
      payment_status: 'pending',
      total_amount: 100.00,
      tip_amount: 0,
      metadata: { test: true }
    };

    // Try to insert the test booking
    const { data, error } = await supabaseClient
      .from('bookings')
      .insert([testBooking])
      .select()
      .single();

    if (error) {
      console.error('Error creating test booking:', error);
      return false;
    }

    console.log('Successfully created test booking:', data);

    // Clean up test data
    const { error: deleteError } = await supabaseClient
      .from('bookings')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.error('Error cleaning up test booking:', deleteError);
    }

    return true;
  } catch (error) {
    console.error('Error checking table:', error);
    return false;
  }
}

// Run the check
checkBookingTable();
