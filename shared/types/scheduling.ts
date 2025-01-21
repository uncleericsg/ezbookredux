/**
 * Scheduling types
 */

/**
 * Time slot entity
 */
export interface TimeSlot {
  /**
   * Time slot ID
   */
  id: string;

  /**
   * Start time
   */
  start_time: string;

  /**
   * End time
   */
  end_time: string;

  /**
   * Whether the time slot is available
   */
  is_available: boolean;

  /**
   * Service ID
   */
  service_id: string;

  /**
   * Technician ID
   */
  technician_id?: string;

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Updated at timestamp
   */
  updated_at: string;
}

/**
 * Database time slot
 */
export interface DatabaseTimeSlot {
  /**
   * Time slot ID
   */
  id: string;

  /**
   * Start time
   */
  start_time: string;

  /**
   * End time
   */
  end_time: string;

  /**
   * Whether the time slot is available
   */
  is_available: boolean;

  /**
   * Service ID
   */
  service_id: string;

  /**
   * Technician ID
   */
  technician_id?: string;

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Updated at timestamp
   */
  updated_at: string;
}

/**
 * Create time slot parameters
 */
export interface CreateTimeSlotParams {
  /**
   * Start time
   */
  start_time: Date;

  /**
   * End time
   */
  end_time: Date;

  /**
   * Service ID
   */
  service_id: string;

  /**
   * Technician ID
   */
  technician_id?: string;
}

/**
 * Time slot service interface
 */
export interface TimeSlotService {
  /**
   * Create a new time slot
   */
  createTimeSlot(params: CreateTimeSlotParams): Promise<TimeSlot>;

  /**
   * Get available time slots for a service within a date range
   */
  getAvailableTimeSlots(
    serviceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeSlot[]>;

  /**
   * Reserve a time slot
   */
  reserveTimeSlot(timeSlotId: string): Promise<TimeSlot>;

  /**
   * Release a time slot
   */
  releaseTimeSlot(timeSlotId: string): Promise<TimeSlot>;
}
