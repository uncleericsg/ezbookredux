import type { BookingData } from './booking-flow';

/**
 * Booking result type
 */
export interface BookingResult {
  data: BookingData | null;
  error?: {
    message: string;
    code?: string;
  } | null;
}

/**
 * Booking service response type
 */
export interface BookingServiceResponse {
  data: BookingData[];
  error: string | null;
}

/**
 * Booking service error type
 */
export interface BookingServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Booking service success type
 */
export interface BookingServiceSuccess<T> {
  data: T;
  error: null;
}

/**
 * Booking service failure type
 */
export interface BookingServiceFailure {
  data: null;
  error: BookingServiceError;
}

/**
 * Booking service result type
 */
export type BookingServiceResult<T> = BookingServiceSuccess<T> | BookingServiceFailure;