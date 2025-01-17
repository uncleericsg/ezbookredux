import type {
  Booking,
  BookingStatus,
  BookingFilters,
  BookingListResponse,
  CreateBookingRequest,
  UpdateBookingRequest
} from '@/types/booking';
import { supabaseClient } from '@/config/supabase/client';
import { handleDatabaseError } from '@/utils/apiErrors';

export const bookingService = {
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .insert({
          userId: data.userId,
          serviceId: data.serviceId,
          scheduledAt: data.scheduledAt,
          totalAmount: data.totalAmount,
          notes: data.notes,
          metadata: data.metadata,
          status: 'PENDING'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return booking;
    } catch (error) {
      throw handleDatabaseError('Failed to create booking');
    }
  },

  async updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
    try {
      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .update({
          userId: data.userId,
          serviceId: data.serviceId,
          scheduledAt: data.scheduledAt,
          status: data.status,
          totalAmount: data.totalAmount,
          notes: data.notes,
          metadata: data.metadata
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return booking;
    } catch (error) {
      throw handleDatabaseError('Failed to update booking');
    }
  },

  async getBookings(filters?: BookingFilters): Promise<BookingListResponse[]> {
    try {
      let query = supabaseClient
        .from('bookings')
        .select(`
          *,
          service:services (
            title,
            description
          )
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.startDate) {
        query = query.gte('scheduledAt', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('scheduledAt', filters.endDate);
      }

      const { data: bookings, error } = await query;

      if (error) {
        throw error;
      }

      return bookings.map((booking: any) => ({
        ...booking,
        service: {
          title: booking.service.title,
          description: booking.service.description
        }
      }));
    } catch (error) {
      throw handleDatabaseError('Failed to fetch bookings');
    }
  }
};
