import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  BookingState, 
  createInitialState, 
  transition, 
  isBookingInProgress 
} from '@utils/bookingState';
import { BookingError } from '@utils/errors';

export const useBookingState = () => {
  const [state, setState] = useState<BookingState>(createInitialState());

  const dispatch = useCallback((action: Parameters<typeof transition>[1]) => {
    setState(currentState => {
      try {
        const newState = transition(currentState, action);
        
        // Show relevant toasts based on state changes
        if (newState.status === 'failed' && newState.error) {
          toast.error(newState.error);
        }
        
        if (newState.warnings.length > 0) {
          newState.warnings.forEach(warning => toast.warning(warning));
        }
        
        if (newState.status === 'confirmed') {
          toast.success('Booking confirmed successfully');
        }
        
        return newState;
      } catch (error) {
        if (error instanceof BookingError && error.toast) {
          toast.error(error.message);
        }
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