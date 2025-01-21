import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  BookingState, 
  BookingAction,
  createInitialState, 
  transition, 
  isBookingInProgress 
} from '@/machines/bookingMachine';

export interface UseBookingState {
  state: BookingState;
  dispatch: (action: BookingAction) => void;
  reset: () => void;
  isInProgress: boolean;
}

export const useBookingState = (): UseBookingState => {
  const [state, setState] = useState<BookingState>(createInitialState());

  const dispatch = useCallback((action: BookingAction) => {
    setState(currentState => {
      try {
        const newState = transition(currentState, action);
        
        // Show relevant toasts based on state changes
        if (newState.error && newState.error !== currentState.error) {
          toast.error(newState.error);
        }
        
        if (newState.warnings.length > currentState.warnings.length) {
          const newWarnings = newState.warnings.slice(currentState.warnings.length);
          newWarnings.forEach(warning => toast.error(warning));
        }
        
        if (newState.status === 'CONFIRMED' && currentState.status !== 'CONFIRMED') {
          toast.success('Booking confirmed successfully');
        }

        if (newState.status === 'COMPLETED' && currentState.status !== 'COMPLETED') {
          toast.success('Booking completed successfully');
        }

        if (newState.status === 'CANCELLED' && currentState.status !== 'CANCELLED') {
          toast.error('Booking cancelled');
        }
        
        return newState;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(message);
        throw error;
      }
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return {
    state,
    dispatch,
    reset,
    isInProgress: isBookingInProgress(state),
  };
};