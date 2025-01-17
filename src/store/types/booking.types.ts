import type { Booking } from '../../types/booking';

export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    date?: string;
  };
} 