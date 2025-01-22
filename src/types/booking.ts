/**
 * Booking status type
 */
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

/**
 * Customer information type
 */
export interface CustomerInfo {
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
}

/**
 * Booking details type
 */
export interface BookingDetails {
  id?: string;
  service_id: string;
  service_title: string;
  service_price: number;
  service_duration: string;
  service_description: string;
  customer_info: CustomerInfo;
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
  metadata?: Record<string, unknown>;
}

/**
 * Booking state type
 */
export interface BookingState {
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  paymentStatus: PaymentStatus | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}

/**
 * Payment status type
 */
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';
