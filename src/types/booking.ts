import type { BaseEntity } from './common';

export interface BookingDetails extends BaseEntity {
  user_id: string;
  service_id: string;
  status: BookingStatus;
  scheduled_date: Date;
  address_id: string;
  notes?: string;
  technician_id?: string;
  payment_id?: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

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
  dateRange?: [Date | null, Date | null];
  technician_id?: string;
  service_id?: string;
}

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
