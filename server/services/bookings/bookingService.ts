import { supabaseClient } from '@server/config/supabase/client';
import { ApiError } from '@server/types/error';
import { logger } from '@server/utils/logger';
import type { Database } from '@server/config/supabase/types';
import type { CreateBookingRequest, BookingStatus } from '@shared/types/booking';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];
type Service = Database['public']['Tables']['services']['Row'];

export class BookingService {
  async createBooking(data: CreateBookingRequest) {
    try {
      logger.info('Creating new booking', { data });

      // Verify service exists
      const { data: service, error: serviceError } = await supabaseClient
        .from('services')
        .select('*')
        .eq('id', data.serviceId)
        .single();

      if (serviceError || !service) {
        throw new ApiError('Service not found', 'NOT_FOUND');
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .insert({
          service_id: data.serviceId,
          customer_id: data.customerId,
          date: data.date,
          notes: data.notes,
          status: 'pending',
          total_amount: service.price
        })
        .select()
        .single();

      if (bookingError) {
        logger.error('Failed to create booking', { error: bookingError });
        throw new ApiError('Failed to create booking', 'SERVER_ERROR');
      }

      return booking;
    } catch (error) {
      logger.error('Error in createBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create booking', 'SERVER_ERROR');
    }
  }

  async getBooking(id: string) {
    try {
      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          service:services(*)
        `)
        .eq('id', id)
        .single();

      if (error || !booking) {
        throw new ApiError('Booking not found', 'NOT_FOUND');
      }

      return booking;
    } catch (error) {
      logger.error('Error in getBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get booking', 'SERVER_ERROR');
    }
  }

  async listBookings(customerId: string, status?: BookingStatus, fromDate?: string, toDate?: string) {
    try {
      let query = supabaseClient
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          service:services(*)
        `)
        .eq('customer_id', customerId);

      if (status) {
        query = query.eq('status', status);
      }

      if (fromDate) {
        query = query.gte('date', fromDate);
      }

      if (toDate) {
        query = query.lte('date', toDate);
      }

      const { data: bookings, error } = await query;

      if (error) {
        throw new ApiError('Failed to list bookings', 'SERVER_ERROR');
      }

      return bookings || [];
    } catch (error) {
      logger.error('Error in listBookings', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to list bookings', 'SERVER_ERROR');
    }
  }

  async cancelBooking(id: string, customerId: string) {
    try {
      // Verify booking exists and belongs to customer
      const { data: booking, error: getError } = await supabaseClient
        .from('bookings')
        .select('*')
        .eq('id', id)
        .eq('customer_id', customerId)
        .single();

      if (getError || !booking) {
        throw new ApiError('Booking not found', 'NOT_FOUND');
      }

      if (booking.status === 'cancelled') {
        throw new ApiError('Booking is already cancelled', 'VALIDATION_ERROR');
      }

      // Update booking status
      const { error: updateError } = await supabaseClient
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (updateError) {
        throw new ApiError('Failed to cancel booking', 'SERVER_ERROR');
      }

      return { success: true };
    } catch (error) {
      logger.error('Error in cancelBooking', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to cancel booking', 'SERVER_ERROR');
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();

// Export individual functions for convenience
export const createBooking = (data: CreateBookingRequest) => bookingService.createBooking(data);
export const getBooking = (id: string) => bookingService.getBooking(id);
export const listBookings = (customerId: string, status?: BookingStatus, fromDate?: string, toDate?: string) => 
  bookingService.listBookings(customerId, status, fromDate, toDate);
export const cancelBooking = (id: string, customerId: string) => bookingService.cancelBooking(id, customerId); 