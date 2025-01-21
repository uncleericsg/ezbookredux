import { useState, useEffect, useCallback } from 'react';
import { addDays } from 'date-fns';
import { useAppSelector } from '../store';
import type { TimeSlot } from '../types/booking-flow';
import type { Region } from '../types/customer';
import { toast } from 'sonner';

interface AvailableSlotsParams {
  startDate: Date;
  endDate: Date;
  region: Region;
}

interface AvailableSlot extends TimeSlot {
  available: boolean;
}

/**
 * Get available appointment slots for a given date range and region
 */
const getAvailableSlots = async (params: AvailableSlotsParams): Promise<AvailableSlot[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', startTime: '09:00', duration: 60, available: true },
        { id: '2', startTime: '10:00', duration: 60, available: false },
        { id: '3', startTime: '11:00', duration: 60, available: true },
        { id: '4', startTime: '14:00', duration: 60, available: true },
        { id: '5', startTime: '15:00', duration: 60, available: false },
        { id: '6', startTime: '16:00', duration: 60, available: true }
      ]);
    }, 1000);
  });
};

/**
 * Hook to get appointment suggestions based on user's region
 */
export const useAppointmentSuggestions = () => {
  const user = useAppSelector(state => state.user.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<AvailableSlot[]>([]);

  const fetchSuggestions = useCallback(async () => {
    if (!user?.customerInfo?.address?.region) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const slots = await getAvailableSlots({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        region: user.customerInfo.address.region as Region
      });
      
      const availableSlots = slots.filter(slot => slot.available);
      setSuggestions(availableSlots);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suggestions';
      setError(new Error(errorMessage));
      toast.error('Failed to load appointment suggestions');
    } finally {
      setLoading(false);
    }
  }, [user?.customerInfo?.address?.region]);

  useEffect(() => {
    void fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refresh: fetchSuggestions
  };
};
