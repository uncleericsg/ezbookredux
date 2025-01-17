import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PaymentStatus } from '@shared/types/payment';

export interface BookingDetails {
  id: string;
  userId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  metadata?: Record<string, any>;
}

interface BookingState {
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  paymentStatus: PaymentStatus | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}

const initialState: BookingState = {
  currentBooking: null,
  bookings: [],
  paymentStatus: null,
  isLoading: false,
  error: null,
  filters: {}
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state: BookingState, action: PayloadAction<BookingDetails | null>) => {
      state.currentBooking = action.payload;
    },
    addBooking: (state: BookingState, action: PayloadAction<BookingDetails>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state: BookingState, action: PayloadAction<BookingDetails>) => {
      const index = state.bookings.findIndex((booking: BookingDetails) => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    removeBooking: (state: BookingState, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter((booking: BookingDetails) => booking.id !== action.payload);
    },
    setBookings: (state: BookingState, action: PayloadAction<BookingDetails[]>) => {
      state.bookings = action.payload;
    },
    setPaymentStatus: (state: BookingState, action: PayloadAction<PaymentStatus>) => {
      state.paymentStatus = action.payload;
    },
    setLoading: (state: BookingState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: BookingState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state: BookingState, action: PayloadAction<BookingState['filters']>) => {
      state.filters = action.payload;
    }
  }
});

export const {
  setCurrentBooking,
  addBooking,
  updateBooking,
  removeBooking,
  setBookings,
  setPaymentStatus,
  setLoading,
  setError,
  setFilters
} = bookingSlice.actions;

export default bookingSlice.reducer;
