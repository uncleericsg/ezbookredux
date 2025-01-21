import { useState } from 'react';
import type { BookingData } from '../types/booking-flow';
import type { BookingStatus } from '@shared/types/booking';

interface BookingError {
  message: string;
  code?: string;
}

interface BookingResponse {
  data?: BookingData;
  error?: BookingError;
}

interface UpdateBookingParams {
  status?: BookingStatus;
  date?: string;
  time?: string;
  serviceId?: string;
  serviceTitle?: string;
  servicePrice?: number;
  serviceDuration?: number;
}

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (params: BookingData): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking');
      }

      return { data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
      console.error('Error in createBooking', { error: err });
      return { error: { message } };
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (bookingId: string, params: UpdateBookingParams): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update booking');
      }

      return { data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update booking';
      setError(message);
      console.error('Error in updateBooking', { error: err, bookingId });
      return { error: { message } };
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingById = async (bookingId: string): Promise<BookingResponse> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/bookings/${bookingId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch booking');
      }

      return { data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch booking';
      setError(message);
      console.error('Error in fetchBookingById', { error: err, bookingId });
      return { error: { message } };
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByEmail = async (email: string): Promise<BookingResponse[]> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/bookings/customer?email=${email}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch bookings');
      }

      return result.map((booking: BookingData) => ({ data: booking }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      console.error('Error in fetchBookingsByEmail', { error: err, email });
      return [{ error: { message } }];
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByCustomerId = async (customerId: string): Promise<BookingResponse[]> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/bookings/customer/${customerId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch bookings');
      }

      return result.map((booking: BookingData) => ({ data: booking }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      console.error('Error in fetchBookingsByCustomerId', { error: err, customerId });
      return [{ error: { message } }];
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
