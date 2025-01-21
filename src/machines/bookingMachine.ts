import type { Booking, BookingStatus } from '@/types/booking';

export interface BookingState {
  status: BookingStatus;
  data: Partial<Booking>;
  error: string | null;
  warnings: string[];
  isLoading: boolean;
}

export type BookingAction =
  | { type: 'START_BOOKING' }
  | { type: 'SET_SERVICE'; serviceId: string }
  | { type: 'SET_DATE'; scheduledAt: string }
  | { type: 'SET_NOTES'; notes: string }
  | { type: 'CONFIRM_BOOKING' }
  | { type: 'COMPLETE_BOOKING' }
  | { type: 'CANCEL_BOOKING' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'ADD_WARNING'; warning: string }
  | { type: 'CLEAR_WARNINGS' }
  | { type: 'RESET' };

export function createInitialState(): BookingState {
  return {
    status: 'PENDING',
    data: {},
    error: null,
    warnings: [],
    isLoading: false
  };
}

export function isBookingInProgress(state: BookingState): boolean {
  return state.status === 'PENDING' || state.isLoading;
}

export function transition(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'START_BOOKING':
      return {
        ...state,
        status: 'PENDING',
        error: null,
        warnings: []
      };

    case 'SET_SERVICE':
      return {
        ...state,
        data: {
          ...state.data,
          serviceId: action.serviceId
        }
      };

    case 'SET_DATE':
      return {
        ...state,
        data: {
          ...state.data,
          scheduledAt: action.scheduledAt
        }
      };

    case 'SET_NOTES':
      return {
        ...state,
        data: {
          ...state.data,
          notes: action.notes
        }
      };

    case 'CONFIRM_BOOKING':
      if (!state.data.serviceId || !state.data.scheduledAt) {
        return {
          ...state,
          error: 'Missing required booking information'
        };
      }
      return {
        ...state,
        status: 'CONFIRMED',
        error: null
      };

    case 'COMPLETE_BOOKING':
      return {
        ...state,
        status: 'COMPLETED',
        error: null
      };

    case 'CANCEL_BOOKING':
      return {
        ...state,
        status: 'CANCELLED',
        error: null
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      };

    case 'ADD_WARNING':
      return {
        ...state,
        warnings: [...state.warnings, action.warning]
      };

    case 'CLEAR_WARNINGS':
      return {
        ...state,
        warnings: []
      };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}