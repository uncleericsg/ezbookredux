import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import type { Booking, CreateBookingRequest } from '@/types/booking';
import type { ErrorMetadata } from '@/types/error';

export class SupabaseBookingService {
  async createBooking(booking: CreateBookingRequest): Promise<Booking | null> {
    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        logger.error('Error creating booking:', { error: error.message } as ErrorMetadata);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error creating booking:', { error: error instanceof Error ? error.message : 'Unknown error' } as ErrorMetadata);
      return null;
    }
  }

  async getBooking(id: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching booking:', { error: error.message } as ErrorMetadata);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error fetching booking:', { error: error instanceof Error ? error.message : 'Unknown error' } as ErrorMetadata);
      return null;
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating booking:', { error: error.message } as ErrorMetadata);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error updating booking:', { error: error instanceof Error ? error.message : 'Unknown error' } as ErrorMetadata);
      return null;
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseClient
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting booking:', { error: error.message } as ErrorMetadata);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error deleting booking:', { error: error instanceof Error ? error.message : 'Unknown error' } as ErrorMetadata);
      return false;
    }
  }
}
