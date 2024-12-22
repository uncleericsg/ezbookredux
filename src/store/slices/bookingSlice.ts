import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BookingState, Booking } from '../../types/redux';

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  filters: {}
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<BookingState['filters']>) => {
      state.filters = action.payload;
    }
  }
});

export const {
  setBookings,
  setCurrentBooking,
  addBooking,
  updateBooking,
  deleteBooking,
  setLoading,
  setError,
  setFilters
} = bookingSlice.actions;

export default bookingSlice.reducer;
