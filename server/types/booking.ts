import type { User } from './user';
import type { PaymentStatus } from './payment';

export interface BookingDetails {
  id: string;
  user_id: string;
  service_id: string;
  booking_date: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateBookingParams {
  user_id: string;
  service_id: string;
  booking_date: string;
  total_amount: number;
}

export interface BookingValidation {
  errors: {
    schedule?: string[];
    price?: string[];
    general?: string[];
  };
  warnings: {
    schedule?: string[];
    price?: string[];
    general?: string[];
  };
}

export interface TimeSlot {
  service_id?: string;
  date: string;
  time: string;
  duration: number;
  status?: 'available' | 'booked' | 'blocked';
  booking_id?: string;
  technician_id?: string;
  price_multiplier?: number;
}

export interface BookingState {
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: BookingStatus;
    date?: string;
    service?: string;
  };
  errors: {
    schedule?: string[];
    price?: string[];
    general?: string[];
  };
  warnings: {
    schedule?: string[];
    price?: string[];
    general?: string[];
  };
  paymentStatus: PaymentStatus;
  verificationId: string | null;
  phone: string | null;
}