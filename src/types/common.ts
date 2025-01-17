export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  price_multiplier?: number;
  service_id?: string;
  date: string;
  time: string;
  duration: number;
  status?: 'available' | 'booked' | 'blocked';
  booking_id?: string;
  technician_id?: string;
}

export interface Region {
  id: string;
  name: string;
  postal_codes: string[];
  is_active: boolean;
} 