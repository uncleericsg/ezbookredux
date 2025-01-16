import { useState } from 'react';
import type { 
  BookingDetails, 
  CreateBookingParams, 
  UpdateBookingParams, 
  BookingResponse 
} from '@shared/types/booking';
import {
  createBooking as createBookingService,
  updateBooking as updateBookingService,
  getBookingById,
  getBookingsByEmail,
  getBookingsByCustomerId
} from '@/services/bookingService';
import { logger } from '@/utils/logger';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (params: CreateBookingParams): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createBookingService(params);
      
      if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
      logger.error('Error in createBooking', { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (bookingId: string, params: UpdateBookingParams): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateBookingService(bookingId, params);
      
      if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update booking';
      setError(message);
      logger.error('Error in updateBooking', { error: err, bookingId });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingById = async (bookingId: string): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBookingById(bookingId);
      
      if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch booking';
      setError(message);
      logger.error('Error in fetchBookingById', { error: err, bookingId });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByEmail = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBookingsByEmail(email);
      
      if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      logger.error('Error in fetchBookingsByEmail', { error: err, email });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByCustomerId = async (customerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getBookingsByCustomerId(customerId);
      
      if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      logger.error('Error in fetchBookingsByCustomerId', { error: err, customerId });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBooking,
    updateBooking,
    fetchBookingById,
    fetchBookingsByEmail,
    fetchBookingsByCustomerId
  };
};
