import { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { incrementVisitLabel } from '@services/repairShopr';
import { validateBookingDetails } from '@utils/bookingValidation';
import { BookingError } from '@utils/errors';
import { toast } from 'sonner';
import { RootState } from '@store';

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const bookingInProgress = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.currentUser);

  const bookNewAppointment = async (datetime: string, categoryId: string): Promise<string> => {
    if (bookingInProgress.current) {
      toast.error('A booking is already in progress');
      throw new Error('Booking in progress');
    }

    if (!user) {
      toast.error('Please log in to book appointments');
      throw new Error('Authentication required');
    }

    setError(null);
    setLoading(true);
    bookingInProgress.current = true;

    const isAMC = categoryId === 'amc';

    try {
      // Validate booking details
      const validation = validateBookingDetails(user?.id, datetime, categoryId, isAMC);
      
      if (!validation.isValid) {
        validation.errors.forEach((error: string) => toast.error(error));
        throw new Error(validation.errors[0]);
      }

      if (validation.warnings?.length) {
        validation.warnings.forEach((warning: string) => toast.warning(warning));
      }

      // TODO: Replace with local booking implementation
      const appointmentId = await createLocalAppointment({
        datetime,
        userDetails: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          address: user.address || ''
        },
        categoryId,
        notes: `Scheduled via iAircon Easy Booking${isAMC ? ' (AMC Service)' : ''}`
      });
      
      if (isAMC && user.amcStatus === 'active') {
        try { 
          await incrementVisitLabel(user.id);
        } catch (error) {
          console.error('Failed to increment AMC visit:', error);
          toast.warning('Your appointment is booked, but there was an issue updating the AMC visit count');
        }
      }
      
      return appointmentId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to book appointment';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
      bookingInProgress.current = false;
    }
  };

  return {
    bookNewAppointment,
    loading,
    error,
  };
};

// Temporary local booking implementation
const createLocalAppointment = async (bookingDetails: {
  datetime: string;
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  categoryId: string;
  notes: string;
}): Promise<string> => {
  // TODO: Implement proper local booking logic
  return Promise.resolve('local-appointment-id');
};