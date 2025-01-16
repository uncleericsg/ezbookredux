import type { Address } from './address';

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

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingDetails {
  id?: string;
  
  // Customer Information
  customer_info: CustomerInfo;
  
  // Address Information
  address_id?: string;
  address_snapshot?: Address;
  
  // Service Information
  service_id: string;
  service_title: string;
  service_price: number;
  service_duration: string;
  service_description?: string;
  
  // Booking Details
  brands: string[];
  issues: string[];
  other_issue?: string;
  is_amc: boolean;
  
  // Schedule Information
  scheduled_datetime: Date;
  scheduled_timeslot: string;
  
  // Status and Timestamps
  status?: BookingStatus;
  created_at?: string;
  updated_at?: string;
  
  // Payment Information
  payment_status?: string;
  payment_intent_id?: string;
  total_amount?: number;
  tip_amount?: number;
  
  // Additional Metadata
  metadata?: Record<string, any>;
}

export interface CreateBookingParams extends Omit<BookingDetails, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateBookingParams extends Partial<BookingDetails> {}

export interface BookingResponse {
  data?: BookingDetails;
  error?: {
    message: string;
    code: string;
  };
}

export interface BookingsListResponse {
  data?: BookingDetails[];
  error?: {
    message: string;
    code: string;
  };
} 