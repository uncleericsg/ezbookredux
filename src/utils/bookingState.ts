import type { BookingState } from '@/types/booking';

export function updateBookingState(state: BookingState, updates: Partial<BookingState>): BookingState {
  return { ...state, ...updates };
}

export function setBookingError(state: BookingState, error: string): BookingState {
  return { ...state, error, isLoading: false };
}

export function clearBookingError(state: BookingState): BookingState {
  return { ...state, error: null };
}

export function setBookingLoading(state: BookingState, isLoading: boolean): BookingState {
  return { ...state, isLoading };
}

export function validateBookingState(state: BookingState): boolean {
  return !!(
    state.userId &&
    state.serviceType &&
    state.scheduledAt
  );
}