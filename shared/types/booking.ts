import type { BaseEntity } from './repository';
import type { Service } from './service';

/**
 * Booking status
 */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'rescheduled';

/**
 * Booking payment status
 */
export type BookingPaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

/**
 * Location input
 */
export interface LocationInput {
  /**
   * Street address
   */
  address: string;

  /**
   * Postal code
   */
  postalCode: string;

  /**
   * Coordinates (optional)
   */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Time slot type
 */
export interface TimeSlot {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Start time in HH:mm format
   */
  startTime: string;
}

/**
 * Booking filters
 */
export interface BookingFilters {
  /**
   * Filter by user ID
   */
  userId?: string;

  /**
   * Filter by status
   */
  status?: BookingStatus;

  /**
   * Filter by date range - from
   */
  fromDate?: string;

  /**
   * Filter by date range - to
   */
  toDate?: string;

  /**
   * Filter by technician
   */
  technicianId?: string;
}

/**
 * Create booking input
 */
export interface CreateBookingInput {
  /**
   * Customer ID
   */
  customerId: string;

  /**
   * Service ID
   */
  serviceId: string;

  /**
   * Booking date
   */
  date: string;

  /**
   * Booking time (HH:mm)
   */
  time: string;

  /**
   * Duration in minutes
   */
  duration: number;

  /**
   * Location details
   */
  location: LocationInput;

  /**
   * Additional notes (optional)
   */
  notes?: string;

  /**
   * Service provider ID (optional)
   */
  technicianId?: string;

  /**
   * Metadata (optional)
   */
  metadata?: Record<string, unknown>;
}

/**
 * Update booking input
 */
export interface UpdateBookingInput {
  /**
   * Service ID (optional)
   */
  serviceId?: string;

  /**
   * Booking date (optional)
   */
  date?: string;

  /**
   * Booking time (optional)
   */
  time?: string;

  /**
   * Duration in minutes (optional)
   */
  duration?: number;

  /**
   * Location details (optional)
   */
  location?: LocationInput;

  /**
   * Additional notes (optional)
   */
  notes?: string;

  /**
   * Service provider ID (optional)
   */
  technicianId?: string;

  /**
   * Booking status (optional)
   */
  status?: BookingStatus;

  /**
   * Payment status (optional)
   */
  paymentStatus?: BookingPaymentStatus;

  /**
   * Payment ID (optional)
   */
  paymentId?: string;

  /**
   * Cancellation reason (optional)
   */
  cancellationReason?: string;

  /**
   * Rescheduling details (optional)
   */
  rescheduling?: {
    fromDate: string;
    fromTime: string;
    reason: string;
  };

  /**
   * Service completion details (optional)
   */
  completion?: {
    completedAt: string;
    duration: number;
    notes: string;
    rating?: number;
    review?: string;
    photos?: string[];
  };

  /**
   * Metadata (optional)
   */
  metadata?: Record<string, unknown>;
}

/**
 * Booking entity
 */
export interface Booking extends BaseEntity {
  /**
   * Customer ID
   */
  customerId: string;

  /**
   * Service ID
   */
  serviceId: string;

  /**
   * Booking date
   */
  date: Date;

  /**
   * Booking time (HH:mm)
   */
  time: string;

  /**
   * Duration in minutes
   */
  duration: number;

  /**
   * Total price
   */
  price: number;

  /**
   * Booking status
   */
  status: BookingStatus;

  /**
   * Payment status
   */
  paymentStatus: BookingPaymentStatus;

  /**
   * Payment ID (if paid)
   */
  paymentId?: string;

  /**
   * Location details
   */
  location: {
    address: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  /**
   * Additional notes
   */
  notes?: string;

  /**
   * Cancellation reason
   */
  cancellationReason?: string;

  /**
   * Cancellation date
   */
  cancelledAt?: Date;

  /**
   * Rescheduling details
   */
  rescheduling?: {
    fromDate: Date;
    fromTime: string;
    reason: string;
  };

  /**
   * Service provider ID (assigned technician)
   */
  technicianId?: string;

  /**
   * Service completion details
   */
  completion?: {
    completedAt: Date;
    duration: number;
    notes: string;
    rating?: number;
    review?: string;
    photos?: string[];
  };

  /**
   * Metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Booking with service details
 */
export interface BookingWithService extends Booking {
  /**
   * Service details
   */
  service: Service;
}
