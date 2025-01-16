import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import type { Database } from '@server/types/database';
import type {
  BookingDetails,
  CreateBookingParams,
  UpdateBookingParams,
  BookingResponse,
  BookingsListResponse
} from '@shared/types/booking';
import { logger } from '@server/utils/logger';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createBooking(params: CreateBookingParams): Promise<BookingResponse> {
  try {
    const bookingId = uuidv4();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        ...params,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create booking', { error, params });
      return {
        error: {
          message: error.message,
          code: 'BOOKING_CREATE_ERROR'
        }
      };
    }

    logger.info('Booking created successfully', { bookingId });
    return { data };
  } catch (error) {
    logger.error('Error in createBooking', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to create booking',
        code: 'BOOKING_CREATE_ERROR'
      }
    };
  }
}

export async function updateBooking(
  bookingId: string,
  params: UpdateBookingParams
): Promise<BookingResponse> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...params,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update booking', { error, bookingId, params });
      return {
        error: {
          message: error.message,
          code: 'BOOKING_UPDATE_ERROR'
        }
      };
    }

    logger.info('Booking updated successfully', { bookingId });
    return { data };
  } catch (error) {
    logger.error('Error in updateBooking', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to update booking',
        code: 'BOOKING_UPDATE_ERROR'
      }
    };
  }
}

export async function getBookingById(bookingId: string): Promise<BookingResponse> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      logger.error('Failed to get booking', { error, bookingId });
      return {
        error: {
          message: error.message,
          code: 'BOOKING_NOT_FOUND'
        }
      };
    }

    return { data };
  } catch (error) {
    logger.error('Error in getBookingById', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to get booking',
        code: 'BOOKING_FETCH_ERROR'
      }
    };
  }
}

export async function getBookingsByEmail(email: string): Promise<BookingsListResponse> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_info->email', email)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get bookings by email', { error, email });
      return {
        error: {
          message: error.message,
          code: 'BOOKINGS_FETCH_ERROR'
        }
      };
    }

    return { data: data || [] };
  } catch (error) {
    logger.error('Error in getBookingsByEmail', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to get bookings',
        code: 'BOOKINGS_FETCH_ERROR'
      }
    };
  }
}

export async function getBookingsByCustomerId(customerId: string): Promise<BookingsListResponse> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get bookings by customer ID', { error, customerId });
      return {
        error: {
          message: error.message,
          code: 'BOOKINGS_FETCH_ERROR'
        }
      };
    }

    return { data: data || [] };
  } catch (error) {
    logger.error('Error in getBookingsByCustomerId', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to get bookings',
        code: 'BOOKINGS_FETCH_ERROR'
      }
    };
  }
} 