import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

export async function migrateBookingTable() {
  try {
    // Get all bookings
    const { data: bookings, error: fetchError } = await supabase
      .from('bookings')
      .select('*');

    if (fetchError) {
      throw fetchError;
    }

    // Update each booking
    for (const booking of bookings || []) {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: booking.status || 'pending',
          payment_status: booking.payment_status || 'pending',
          created_at: booking.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (updateError) {
        throw updateError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error migrating booking table:', error);
    return { success: false, error };
  }
}
