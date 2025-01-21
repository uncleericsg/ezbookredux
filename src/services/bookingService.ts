import type {
  Booking,
  BookingStatus,
  BookingFilters,
  BookingListResponse,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingWithService
} from '@shared/types/booking';
import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/utils/logger';
import { ServiceResponse, AsyncServiceResponse, createServiceHandler } from '@/types/api';
import { APIError } from '@/utils/apiErrors';

const serviceHandler = createServiceHandler<Booking>();
const listHandler = createServiceHandler<BookingWithService[]>();

const validateBookingData = (data: Partial<CreateBookingRequest>): void => {
  const requiredFields = ['userId', 'serviceId', 'scheduledAt'];
  const missingFields = requiredFields.filter(field => !data[field as keyof CreateBookingRequest]);
  
  if (missingFields.length > 0) {
    throw new APIError(
      'VALIDATION_ERROR',
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      { missingFields }
    );
  }
};

export const bookingService = {
  async createBooking(data: CreateBookingRequest): AsyncServiceResponse<Booking> {
    try {
      validateBookingData(data);

      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .insert({
          ...data,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new APIError(
          'DATABASE_ERROR',
          error.message,
          500,
          { code: error.code }
        );
      }

      if (!booking) {
        throw new APIError(
          'DATABASE_ERROR',
          'Failed to create booking',
          500
        );
      }

      return {
        data: booking,
        status: 'success'
      };

    } catch (err: unknown) {
      logger.error('Error creating booking:', err);
      return {
        error: {
          code: err instanceof APIError ? err.code : 'INTERNAL_ERROR',
          message: err instanceof Error ? err.message : 'Failed to create booking',
          details: err instanceof APIError ? err.details : undefined
        },
        status: 'error'
      };
    }
  },

  async updateBooking(id: string, data: UpdateBookingRequest): AsyncServiceResponse<Booking> {
    try {
      const { data: booking, error } = await supabaseClient
        .from('bookings')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new APIError(
          'DATABASE_ERROR',
          error.message,
          500,
          { code: error.code }
        );
      }

      if (!booking) {
        throw new APIError(
          'NOT_FOUND',
          'Booking not found',
          404,
          { bookingId: id }
        );
      }

      return {
        data: booking,
        status: 'success'
      };

    } catch (err: unknown) {
      logger.error('Error updating booking:', err);
      return {
        error: {
          code: err instanceof APIError ? err.code : 'INTERNAL_ERROR',
          message: err instanceof Error ? err.message : 'Failed to update booking',
          details: err instanceof APIError ? err.details : undefined
        },
        status: 'error'
      };
    }
  },

  async getBookings(filters?: BookingFilters): AsyncServiceResponse<BookingWithService[]> {
    try {
      let query = supabaseClient
        .from('bookings')
        .select(`
          *,
          service:services (*)
        `);

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.fromDate) {
        query = query.gte('scheduled_at', filters.fromDate);
      }

      if (filters?.toDate) {
        query = query.lte('scheduled_at', filters.toDate);
      }

      const { data: bookings, error } = await query;

      if (error) {
        throw new APIError(
          'DATABASE_ERROR',
          error.message,
          500,
          { code: error.code }
        );
      }

      return {
        data: bookings || [],
        status: 'success'
      };

    } catch (err: unknown) {
      logger.error('Error fetching bookings:', err);
      return {
        error: {
          code: err instanceof APIError ? err.code : 'INTERNAL_ERROR',
          message: err instanceof Error ? err.message : 'Failed to fetch bookings',
          details: err instanceof APIError ? err.details : undefined
        },
        status: 'error'
      };
    }
  }
};
