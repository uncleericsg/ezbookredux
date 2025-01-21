import { useReducer, useCallback } from 'react';
import { toast } from 'sonner';
import { createBookingMachine } from '@/machines/bookingMachine';
import type { 
  BookingState, 
  BookingAction,
  BookingDetails,
  PaymentDetails
} from '@/machines/bookingMachine';

export type { BookingDetails, PaymentDetails };

export function hasRequiredDetails(state: BookingState): boolean {
  return !!(
    state.service &&
    state.date &&
    state.time &&
    state.details?.user
  );
}

export function hasPaymentDetails(state: BookingState): boolean {
  return !!(
    state.payment?.amount &&
    state.payment?.currency &&
    state.payment?.method
  );
}

interface TimeComponents {
  hours: number;
  minutes: number;
}

function isValidTimeString(timeStr: unknown): timeStr is string {
  return typeof timeStr === 'string' && /^\d{1,2}:\d{2}$/.test(timeStr);
}

function parseTimeComponents(timeStr: string | undefined | null): TimeComponents | null {
  if (!timeStr) return null;

  try {
    const [hoursStr = '', minutesStr = ''] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (
      isNaN(hours) || 
      isNaN(minutes) || 
      hours < 0 || 
      hours > 23 || 
      minutes < 0 || 
      minutes > 59
    ) {
      return null;
    }

    return { hours, minutes };
  } catch {
    return null;
  }
}

function parseTimeString(timeStr: unknown): TimeComponents | null {
  if (!isValidTimeString(timeStr)) return null;
  return parseTimeComponents(timeStr);
}

function isValidDateString(dateStr: unknown): dateStr is string {
  return typeof dateStr === 'string' && !isNaN(Date.parse(dateStr));
}

function parseDate(dateStr: unknown): Date | null {
  if (!isValidDateString(dateStr)) return null;

  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function getFormattedBookingTime(state: BookingState): string {
  const date = parseDate(state.date);
  if (!date) return '';

  const timeComponents = parseTimeString(state.time);
  if (!timeComponents) return '';

  try {
    date.setHours(timeComponents.hours);
    date.setMinutes(timeComponents.minutes);

    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch {
    return '';
  }
}

export function getBookingSummary(state: BookingState): string {
  const parts: string[] = [];

  if (state.service) {
    parts.push(`Service: ${state.service.name}`);
  }

  if (state.date && state.time) {
    const formattedTime = getFormattedBookingTime(state);
    if (formattedTime) {
      parts.push(`Time: ${formattedTime}`);
    }
  }

  if (state.details?.user) {
    parts.push(`Customer: ${state.details.user.firstName} ${state.details.user.lastName}`);
  }

  if (state.payment) {
    parts.push(`Payment: ${state.payment.amount} ${state.payment.currency}`);
  }

  return parts.join('\n');
}

const defaultState: BookingState = {
  status: 'IDLE',
  warnings: [],
  error: undefined
};

export function useBookingState(initialState?: Partial<BookingState>) {
  const [state, dispatch] = useReducer(
    createBookingMachine(),
    {
      ...defaultState,
      ...initialState
    }
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const isInProgress = state.status !== 'IDLE' && 
    state.status !== 'COMPLETED' && 
    state.status !== 'CANCELLED';

  return {
    state,
    dispatch,
    reset,
    isInProgress
  };
}

export type UseBookingState = ReturnType<typeof useBookingState>;