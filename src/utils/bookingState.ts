import { BookingError } from '@utils/errors';

export type BookingStatus = 
  | 'idle' 
  | 'validating'
  | 'submitting'
  | 'retrying'
  | 'confirmed'
  | 'failed';

export interface BookingState {
  status: BookingStatus;
  error?: string;
  retryCount: number;
  lastAttempt?: Date;
  validationErrors: string[];
  warnings: string[];
}

export const createInitialState = (): BookingState => ({
  status: 'idle',
  retryCount: 0,
  validationErrors: [],
  warnings: [],
});

export const isBookingInProgress = (state: BookingState): boolean => {
  return ['validating', 'submitting', 'retrying'].includes(state.status);
};

export const canRetry = (state: BookingState, maxRetries: number = 3): boolean => {
  if (state.status !== 'failed') return false;
  if (state.retryCount >= maxRetries) return false;
  
  // Check if last attempt was within 30 seconds
  if (state.lastAttempt) {
    const timeSinceLastAttempt = Date.now() - state.lastAttempt.getTime();
    if (timeSinceLastAttempt < 30000) return false;
  }
  
  return true;
};

export const transition = (
  currentState: BookingState,
  action: {
    type: 'START_VALIDATION' | 'VALIDATION_COMPLETE' | 'START_BOOKING' | 
          'BOOKING_SUCCESS' | 'BOOKING_FAILED' | 'RETRY' | 'RESET';
    error?: string;
    validationErrors?: string[];
    warnings?: string[];
  }
): BookingState => {
  switch (action.type) {
    case 'START_VALIDATION':
      if (isBookingInProgress(currentState)) {
        throw new BookingError(
          'Booking already in progress',
          'BOOKING_IN_PROGRESS',
          false,
          true
        );
      }
      return {
        ...currentState,
        status: 'validating',
        error: undefined,
        validationErrors: [],
        warnings: [],
      };

    case 'VALIDATION_COMPLETE':
      return {
        ...currentState,
        status: 'idle',
        validationErrors: action.validationErrors || [],
        warnings: action.warnings || [],
      };

    case 'START_BOOKING':
      if (isBookingInProgress(currentState)) {
        throw new BookingError(
          'Booking already in progress',
          'BOOKING_IN_PROGRESS',
          false,
          true
        );
      }
      return {
        ...currentState,
        status: 'submitting',
        error: undefined,
      };

    case 'BOOKING_SUCCESS':
      return {
        ...currentState,
        status: 'confirmed',
        error: undefined,
        retryCount: 0,
      };

    case 'BOOKING_FAILED':
      return {
        ...currentState,
        status: 'failed',
        error: action.error,
        lastAttempt: new Date(),
      };

    case 'RETRY':
      if (!canRetry(currentState)) {
        throw new BookingError(
          'Maximum retry attempts reached',
          'MAX_RETRIES',
          false,
          true
        );
      }
      return {
        ...currentState,
        status: 'retrying',
        retryCount: currentState.retryCount + 1,
      };

    case 'RESET':
      return createInitialState();

    default:
      return currentState;
  }
};