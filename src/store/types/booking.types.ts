import type { BookingDetails } from '../../types/booking';

export interface BookingState {
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  filters: {
    status: string[];
    dateRange: [Date | null, Date | null];
  };
  loading: boolean;
  error: string | null;
} 