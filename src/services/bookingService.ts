import { createClient } from '@supabase/supabase-js';
import { Booking, CreateBookingRequest, BookingStatus, BookingFilters, BookingListResponse, UpdateBookingRequest } from '../types/booking';
import { createApiError } from '../utils/apiResponse';
import { Database } from '../types/supabase';

// Add this type to handle the joined response from Supabase
interface BookingWithRelations extends Booking {
  customer: {
    id: string;
    full_name: string | null;
    email: string;
  };
  service: {
    id: string;
    title: string;
    price: number;
  };
  address: {
    id: string;
    block_street: string;
    floor_unit: string;
    postal_code: string;
  };
}

export class BookingService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      // First get the service to calculate total amount
      const { data: service, error: serviceError } = await this.supabase
        .from('services')
        .select('price, padding_before_minutes, padding_after_minutes')
        .eq('id', data.service_id)
        .single();

      if (serviceError || !service) {
        throw createApiError('Service not found', 'NOT_FOUND');
      }

      const bookingData = {
        ...data,
        status: 'pending' as BookingStatus,
        payment_status: 'pending',
        total_amount: service.price,
        padding_start: new Date(data.scheduled_start)
          .setMinutes(new Date(data.scheduled_start).getMinutes() - service.padding_before_minutes),
        padding_end: new Date(data.scheduled_end)
          .setMinutes(new Date(data.scheduled_end).getMinutes() + service.padding_after_minutes)
      };

      const { data: booking, error } = await this.supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      if (!booking) throw new Error('Failed to create booking');

      return booking;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw createApiError('Failed to create booking', 'SERVER_ERROR');
    }
  }

  async getBooking(id: string): Promise<BookingWithRelations> {
    try {
      const { data: booking, error } = await this.supabase
        .from('bookings')
        .select(`
          *,
          service:services(id, title, price),
          address:addresses(id, block_street, floor_unit, postal_code),
          customer:profiles(id, full_name, email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!booking) throw createApiError('Booking not found', 'NOT_FOUND');

      return booking as BookingWithRelations;
    } catch (error) {
      console.error('Get booking error:', error);
      throw createApiError('Failed to fetch booking', 'SERVER_ERROR');
    }
  }

  async listBookings(userId: string, filters?: BookingFilters): Promise<BookingListResponse[]> {
    try {
      let query = this.supabase
        .from('bookings')
        .select(`
          id,
          scheduled_start,
          scheduled_end,
          status,
          total_amount,
          service:services(id, title),
          address:addresses(id, block_street, postal_code)
        `)
        .eq('user_id', userId)
        .order('scheduled_start', { ascending: false });

      // Apply filters
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.date_from) {
        query = query.gte('scheduled_start', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('scheduled_start', filters.date_to);
      }
      if (filters?.service_id) {
        query = query.eq('service_id', filters.service_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('List bookings error:', error);
      throw createApiError('Failed to fetch bookings', 'SERVER_ERROR');
    }
  }

  async cancelBooking(userId: string, bookingId: string): Promise<void> {
    try {
      // Verify booking exists and belongs to user
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('id, status, scheduled_start')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .single();

      if (bookingError || !booking) {
        throw createApiError('Booking not found', 'NOT_FOUND');
      }

      // Check if booking can be cancelled
      if (booking.status === 'cancelled') {
        throw createApiError('Booking is already cancelled', 'VALIDATION_ERROR');
      }
      if (booking.status === 'completed') {
        throw createApiError('Cannot cancel completed booking', 'VALIDATION_ERROR');
      }

      // Check cancellation window (e.g., 24 hours before)
      const bookingStart = new Date(booking.scheduled_start);
      const now = new Date();
      const hoursUntilBooking = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilBooking < 24) {
        throw createApiError('Cannot cancel booking within 24 hours', 'VALIDATION_ERROR');
      }

      // Cancel booking
      const { error: updateError } = await this.supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw createApiError('Failed to cancel booking', 'SERVER_ERROR');
    }
  }

  async updateBooking(
    userId: string, 
    bookingId: string, 
    data: UpdateBookingRequest
  ): Promise<Booking> {
    try {
      // Verify booking exists and belongs to user
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .single();

      if (bookingError || !booking) {
        throw createApiError('Booking not found', 'NOT_FOUND');
      }

      // Check if booking can be updated
      if (booking.status === 'completed' || booking.status === 'cancelled') {
        throw createApiError(
          'Cannot update completed or cancelled booking', 
          'VALIDATION_ERROR'
        );
      }

      // If updating schedule, validate new time slot
      if (data.scheduled_start || data.scheduled_end) {
        const { data: service } = await this.supabase
          .from('services')
          .select('duration_minutes, padding_before_minutes, padding_after_minutes')
          .eq('id', booking.service_id)
          .single();

        if (!service) throw new Error('Service not found');

        // Calculate padding times
        const paddingStart = new Date(data.scheduled_start || booking.scheduled_start)
          .setMinutes(new Date(data.scheduled_start || booking.scheduled_start)
            .getMinutes() - service.padding_before_minutes);

        const paddingEnd = new Date(data.scheduled_end || booking.scheduled_end)
          .setMinutes(new Date(data.scheduled_end || booking.scheduled_end)
            .getMinutes() + service.padding_after_minutes);

        // Check for conflicts
        const { data: conflicts, error: conflictError } = await this.supabase
          .from('bookings')
          .select('id')
          .neq('id', bookingId)
          .eq('service_id', booking.service_id)
          .not('status', 'eq', 'cancelled')
          .or(`padding_start.gte.${paddingStart},padding_end.lte.${paddingEnd}`);

        if (conflictError) throw conflictError;
        if (conflicts?.length) {
          throw createApiError('Time slot is not available', 'VALIDATION_ERROR');
        }

        // Add padding times to update data
        data = {
          ...data,
          padding_start: new Date(paddingStart).toISOString(),
          padding_end: new Date(paddingEnd).toISOString()
        };
      }

      // Update booking
      const { data: updatedBooking, error: updateError } = await this.supabase
        .from('bookings')
        .update(data)
        .eq('id', bookingId)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!updatedBooking) throw new Error('Failed to update booking');

      return updatedBooking;
    } catch (error) {
      console.error('Update booking error:', error);
      throw createApiError('Failed to update booking', 'SERVER_ERROR');
    }
  }
}
