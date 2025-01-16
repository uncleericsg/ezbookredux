import type { ApiError } from '@/utils/errors';
import type { BookingState } from '@/types/booking';

export function handleBookingError(error: ApiError, state: BookingState): BookingState {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return {
        ...state,
        error: 'Invalid booking details. Please check your input.',
        loading: false
      };
    case 'SERVICE_ERROR':
      return {
        ...state,
        error: 'Service is temporarily unavailable. Please try again later.',
        loading: false
      };
    case 'PAYMENT_ERROR':
      return {
        ...state,
        error: 'Payment processing failed. Please try again.',
        loading: false
      };
    case 'UNAUTHORIZED':
      return {
        ...state,
        error: 'Please log in to continue with your booking.',
        loading: false
      };
    case 'RATE_LIMIT_ERROR':
      return {
        ...state,
        error: 'Too many booking attempts. Please wait before trying again.',
        loading: false
      };
    default:
      return {
        ...state,
        error: 'An unexpected error occurred. Please try again.',
        loading: false
      };
  }
}

export function validateBookingState(state: BookingState): boolean {
  if (state.loading) {
    return false;
  }

  if (state.error) {
    return false;
  }

  if (!state.currentBooking) {
    return false;
  }

  return true;
}