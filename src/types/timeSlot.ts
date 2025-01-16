export interface TimeSlot {
  start_time: string;  // ISO 8601
  end_time: string;    // ISO 8601
  is_available: boolean;
  is_peak_hour: boolean;
  price_multiplier: number;
  service_id?: string;
  technician_id?: string;
}

export interface GetTimeSlotsRequest {
  service_id: string;
  date: string;        // YYYY-MM-DD
  technician_id?: string;
}

export interface TimeSlotConfig {
  peak_hours_start: number;    // 0-23
  peak_hours_end: number;      // 0-23
  peak_price_multiplier: number;
  min_booking_notice_hours: number;
  max_advance_booking_days: number;
  working_hours_start: number; // 0-23
  working_hours_end: number;   // 0-23
} 