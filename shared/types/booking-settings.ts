/**
 * Booking settings types
 */

/**
 * Time slots configuration
 */
export interface TimeSlotConfig {
  /**
   * Enable time slots
   */
  enabled: boolean;

  /**
   * Slot duration in minutes
   */
  duration: number;

  /**
   * Start time of the day (HH:mm)
   */
  startTime: string;

  /**
   * End time of the day (HH:mm)
   */
  endTime: string;

  /**
   * Break duration between slots in minutes
   */
  breakDuration: number;
}

/**
 * Scheduling configuration
 */
export interface SchedulingConfig {
  /**
   * Minimum advance booking time in hours
   */
  minAdvanceBooking: number;

  /**
   * Maximum advance booking time in days
   */
  maxAdvanceBooking: number;

  /**
   * Allow same day bookings
   */
  allowSameDay: boolean;

  /**
   * Allow weekend bookings
   */
  allowWeekends: boolean;
}

/**
 * Capacity configuration
 */
export interface CapacityConfig {
  /**
   * Maximum bookings per day
   */
  maxBookingsPerDay: number;

  /**
   * Maximum bookings per time slot
   */
  maxBookingsPerSlot: number;

  /**
   * Overbooking buffer (percentage)
   */
  overbookingBuffer: number;
}

/**
 * Restrictions configuration
 */
export interface RestrictionsConfig {
  /**
   * Enable restrictions
   */
  enabled: boolean;

  /**
   * Maximum bookings per user
   */
  maxBookingsPerUser: number;

  /**
   * Cancellation period in hours
   */
  cancellationPeriod: number;
}

/**
 * Booking configuration
 */
export interface BookingConfig {
  /**
   * Time slots configuration
   */
  timeSlots: TimeSlotConfig;

  /**
   * Scheduling configuration
   */
  scheduling: SchedulingConfig;

  /**
   * Capacity configuration
   */
  capacity: CapacityConfig;

  /**
   * Restrictions configuration
   */
  restrictions: RestrictionsConfig;
}

/**
 * Default booking configuration
 */
export const defaultBookingConfig: BookingConfig = {
  timeSlots: {
    enabled: true,
    duration: 60,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 15
  },
  scheduling: {
    minAdvanceBooking: 24,
    maxAdvanceBooking: 30,
    allowSameDay: false,
    allowWeekends: false
  },
  capacity: {
    maxBookingsPerDay: 10,
    maxBookingsPerSlot: 2,
    overbookingBuffer: 20
  },
  restrictions: {
    enabled: true,
    maxBookingsPerUser: 3,
    cancellationPeriod: 24
  }
};

/**
 * Booking settings component props
 */
export interface BookingSettingsProps {
  /**
   * Current settings
   */
  settings?: BookingConfig;

  /**
   * Update settings callback
   */
  onUpdate: (settings: BookingConfig) => Promise<void>;

  /**
   * Loading state
   */
  loading?: boolean;
}
