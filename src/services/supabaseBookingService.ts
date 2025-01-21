import type { Booking, CreateBookingInput } from '@shared/types/booking';
import type { AppError } from '@shared/types/error';
import { BaseError } from '@shared/types/error';
import { supabaseClient } from '@/config/supabase/client';
import { createApiError } from '@/utils/error';

export const createBooking = async (data: CreateBookingInput): Promise<Booking> => {
  try {
    const { data: booking, error } = await supabaseClient
      .from('bookings')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    if (!booking) throw createApiError('Failed to create booking', 'DATABASE_ERROR');

    return booking;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw createApiError('Failed to create booking', 'DATABASE_ERROR');
  }
};

export const getBooking = async (id: string): Promise<Booking> => {
  try {
    const { data: booking, error } = await supabaseClient
      .from('bookings')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!booking) throw createApiError('Booking not found', 'NOT_FOUND');

    return booking;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw createApiError('Failed to fetch booking', 'DATABASE_ERROR');
  }
};

export const updateBooking = async (id: string, data: Partial<Booking>): Promise<Booking> => {
  try {
    const { data: booking, error } = await supabaseClient
      .from('bookings')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!booking) throw createApiError('Booking not found', 'NOT_FOUND');

    return booking;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw createApiError('Failed to update booking', 'DATABASE_ERROR');
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    const { error } = await supabaseClient
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }
    throw createApiError('Failed to delete booking', 'DATABASE_ERROR');
  }
};
