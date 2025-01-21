import type { ServiceCategory } from '@/types/homepage';
import type { User } from '@/types/auth';

export interface BookingDetails {
  user: User;
  notes?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: string;
  reference?: string;
}

export type BookingStatus = 
  | 'IDLE'
  | 'SELECTING_DATE'
  | 'ENTERING_DETAILS'
  | 'CONFIRMING'
  | 'PROCESSING_PAYMENT'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ERROR';

export interface BookingState {
  status: BookingStatus;
  service?: ServiceCategory;
  date?: string;
  time?: string;
  details?: BookingDetails;
  payment?: PaymentDetails;
  error?: string | undefined;
  warnings: string[];
  lastAction?: BookingAction;
}

export type BookingAction =
  | { type: 'SELECT_SERVICE'; payload: ServiceCategory }
  | { type: 'SELECT_DATE'; payload: { date: string; time: string } }
  | { type: 'UPDATE_DETAILS'; payload: BookingDetails }
  | { type: 'CONFIRM' }
  | { type: 'PROCESS_PAYMENT'; payload: PaymentDetails }
  | { type: 'COMPLETE' }
  | { type: 'CANCEL' }
  | { type: 'RETRY' }
  | { type: 'RESET' };

export function createBookingMachine() {
  return function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
      case 'SELECT_SERVICE':
        return {
          ...state,
          status: 'SELECTING_DATE',
          service: action.payload,
          error: undefined,
          lastAction: action
        };

      case 'SELECT_DATE':
        if (state.status === 'IDLE') {
          return {
            ...state,
            status: 'ERROR',
            error: 'Must select service first',
            lastAction: action
          };
        }

        return {
          ...state,
          status: 'ENTERING_DETAILS',
          date: action.payload.date,
          time: action.payload.time,
          error: undefined,
          lastAction: action
        };

      case 'UPDATE_DETAILS':
        if (!state.service || !state.date || !state.time) {
          return {
            ...state,
            status: 'ERROR',
            error: 'Must select service and date first',
            lastAction: action
          };
        }

        return {
          ...state,
          status: 'CONFIRMING',
          details: action.payload,
          error: undefined,
          lastAction: action
        };

      case 'CONFIRM':
        if (!state.service || !state.date || !state.time || !state.details) {
          return {
            ...state,
            status: 'ERROR',
            error: 'Missing required details',
            lastAction: action
          };
        }

        return {
          ...state,
          status: 'PROCESSING_PAYMENT',
          error: undefined,
          lastAction: action
        };

      case 'PROCESS_PAYMENT':
        if (state.status !== 'PROCESSING_PAYMENT' && state.status !== 'ERROR') {
          return {
            ...state,
            status: 'ERROR',
            error: 'Invalid state for payment processing',
            lastAction: action
          };
        }

        return {
          ...state,
          status: 'CONFIRMED',
          payment: action.payload,
          error: undefined,
          lastAction: action
        };

      case 'COMPLETE':
        if (state.status !== 'CONFIRMED') {
          return {
            ...state,
            status: 'ERROR',
            error: 'Booking must be confirmed first',
            lastAction: action
          };
        }

        return {
          ...state,
          status: 'COMPLETED',
          error: undefined,
          lastAction: action
        };

      case 'CANCEL':
        return {
          ...state,
          status: 'CANCELLED',
          error: undefined,
          lastAction: action
        };

      case 'RETRY':
        if (state.status !== 'ERROR') {
          return state;
        }

        const previousStatus = state.lastAction?.type === 'PROCESS_PAYMENT' 
          ? 'PROCESSING_PAYMENT' 
          : 'CONFIRMING';

        return {
          ...state,
          status: previousStatus,
          error: undefined,
          lastAction: action
        };

      case 'RESET':
        return {
          status: 'IDLE',
          warnings: [],
          error: undefined
        };

      default:
        return state;
    }
  };
}