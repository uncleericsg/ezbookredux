import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import type { Booking, CreateBookingRequest } from '@shared/types/booking';
import { AppError } from '@shared/types/error';
import { handleDatabaseError, handleValidationError, handleNotFoundError } from '@/utils/apiErrors';

export class SupabaseBookingService {
  async createBooking(booking: CreateBookingRequest): Promise<Booking> {
    try {
      if (!booking.userId || !booking.serviceId || !booking.scheduledAt) {
        throw handleValidationError('Missing required booking fields');
      }

      const { data, error } = await supabaseClient
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        logger.error('Database error while creating booking:', { error, booking });
        throw handleDatabaseError('Failed to create booking');
      }

      if (!data) {
        throw handleDatabaseError('Failed to retrieve created booking');
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Unexpected error while creating booking:', { error });
      throw handleDatabaseError('Failed to create booking');
    }
  }

  async getBooking(id: string): Promise<Booking> {
    try {
      if (!id) {
        throw handleValidationError('Booking ID is required');
      }

      const { data, error } = await supabaseClient
        .from('bookings')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Database error while fetching booking:', { error, id });
        throw handleDatabaseError('Failed to fetch booking');
      }

      if (!data) {
        throw handleNotFoundError('Booking not found');
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Unexpected error while fetching booking:', { error });
      throw handleDatabaseError('Failed to fetch booking');
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    try {
      if (!id) {
        throw handleValidationError('Booking ID is required');
      }

      // First check if booking exists
      const { data: existingBooking, error: fetchError } = await supabaseClient
        .from('bookings')
        .select()
        .eq('id', id)
        .single();

      if (fetchError || !existingBooking) {
        throw handleNotFoundError('Booking not found');
      }

      const { data, error } = await supabaseClient
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Database error while updating booking:', { error, id, updates });
        throw handleDatabaseError('Failed to update booking');
      }

      if (!data) {
        throw handleDatabaseError('Failed to retrieve updated booking');
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Unexpected error while updating booking:', { error });
      throw handleDatabaseError('Failed to update booking');
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      if (!id) {
        throw handleValidationError('Booking ID is required');
      }

      // First check if booking exists
      const { data: existingBooking, error: fetchError } = await supabaseClient
        .from('bookings')
        .select()
        .eq('id', id)
        .single();

      if (fetchError || !existingBooking) {
        throw handleNotFoundError('Booking not found');
      }

      const { error } = await supabaseClient
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Database error while deleting booking:', { error, id });
        throw handleDatabaseError('Failed to delete booking');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Unexpected error while deleting booking:', { error });
      throw handleDatabaseError('Failed to delete booking');
    }
  }
}
