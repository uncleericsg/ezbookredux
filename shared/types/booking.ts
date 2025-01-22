import type { Database } from './database';

/**
 * Booking status
 */
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

/**
 * Payment status
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

/**
 * Booking type from database
 */
export type Booking = Database['public']['Tables']['bookings']['Row'];

/**
 * Booking state for frontend
 */
export interface BookingState {
  currentBooking: Booking | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedService: string | null;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Time slot for booking
 */
export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

/**
 * Booking creation request
 */
export interface CreateBookingRequest {
  userId: string;
  serviceId: string;
  scheduledAt: string;
  notes?: string;
}

/**
 * Booking update request
 */
export interface UpdateBookingRequest {
  status?: BookingStatus;
  scheduledAt?: string;
  notes?: string;
}

/**
 * Booking with related data
 */
export interface BookingWithDetails extends Booking {
  service: Database['public']['Tables']['services']['Row'];
  payment?: Database['public']['Tables']['payments']['Row'];
  user: Database['public']['Tables']['users']['Row'];
}

/**
 * Booking validation
 */
export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Booking filter options
 */
export interface BookingFilters {
  status?: BookingStatus[];
  startDate?: string;
  endDate?: string;
  userId?: string;
  serviceId?: string;
}
