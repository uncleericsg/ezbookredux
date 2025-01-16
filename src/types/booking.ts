import type { BaseEntity } from './common';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  address_id: string;
  scheduled_start: string;
  scheduled_end: string;
  padding_start: string;
  padding_end: string;
  status: BookingStatus;
  payment_status: string;
  payment_id: string | null;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  service_id: string;
  address_id: string;
  scheduled_start: string;
  scheduled_end: string;
  notes?: string;
}

export interface CreateBookingResponse {
  id: string;
  status: BookingStatus;
  bookingReference: string;
  scheduled_start: string;
  scheduled_end: string;
  total_amount: number;
}

export interface TimeSlot {
  start_time: string;
  end_time?: string;
  is_available: boolean;
  is_peak_hour: boolean;
  is_buffer_time?: boolean;
  price_multiplier?: number;
}

export interface BookingFilters {
  status?: BookingStatus[];
  date_from?: string;
  date_to?: string;
  service_id?: string;
}

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BookingCustomer {
  id: string;
  name: string | null;
  email: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
}

export interface GetBookingResponse {
  id: string;
  customer: BookingCustomer;
  service: BookingService;
  status: BookingStatus;
  date: string;
  scheduled_start: string;
  scheduled_end: string;
  total_amount: number;
  payment_status: string;
  notes: string | null;
}

export interface BookingListResponse {
  id: string;
  scheduled_start: string;
  scheduled_end: string;
  status: BookingStatus;
  total_amount: number;
  service: {
    id: string;
    title: string;
  };
  address: {
    id: string;
    block_street: string;
    postal_code: string;
  };
}

export interface UpdateBookingRequest {
  scheduled_start?: string;
  scheduled_end?: string;
  notes?: string | null;
  status?: BookingStatus;
}
