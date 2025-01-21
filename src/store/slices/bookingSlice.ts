import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BookingStatus } from '@shared/types/booking';
import type { PaymentStatus } from '@shared/types/payment';

interface BookingState {
  currentBooking: {
    id?: string;
    service_id: string;
    service_title: string;
    service_price: number;
    service_duration: string;
    service_description: string;
    customer_info: {
      first_name: string;
      last_name: string;
      email: string;
      mobile: string;
      floor_unit: string;
      block_street: string;
      postal_code: string;
      condo_name?: string;
      lobby_tower?: string;
      special_instructions?: string;
    };
    brands: string[];
    issues: string[];
    other_issue?: string;
    is_amc: boolean;
    scheduled_datetime: Date;
    scheduled_timeslot: string;
    status: BookingStatus;
    payment_status: PaymentStatus;
    total_amount: number;
    tip_amount: number;
  } | null;
  error: string | null;
}

const initialState: BookingState = {
  currentBooking: null,
  error: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<BookingState['currentBooking']>) => {
      state.currentBooking = action.payload;
    },
    updateBooking: (state, action: PayloadAction<Partial<NonNullable<BookingState['currentBooking']>>>) => {
      if (state.currentBooking) {
        state.currentBooking = {
          ...state.currentBooking,
          ...action.payload
        };
      }
    },
    clearBooking: (state) => {
      state.currentBooking = null;
      state.error = null;
    },
    setBookingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setCurrentBooking, 
  updateBooking, 
  clearBooking, 
  setBookingError 
} = bookingSlice.actions;

export default bookingSlice.reducer;
