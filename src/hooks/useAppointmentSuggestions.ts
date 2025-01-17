import { useState, useEffect } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/userSlice';
import { toast } from 'react-hot-toast';
import { TimeSlot } from '@shared/types/booking';
import { determineRegion } from '@/services/locations/classifier';
import { getAvailableSlots } from '@/services/bookingService';

export const useAppointmentSuggestions = () => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const slots = await getAvailableSlots({
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          region: user.region
        });
        
        const availableSlots = slots.filter(slot => slot.available);
        setSuggestions(availableSlots);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
        toast.error('Failed to load appointment suggestions');
      } finally {
        setLoading(false);
      }
    };

    if (user.region) {
      fetchSuggestions();
    }
  }, [user.region]);

  return {
    suggestions,
    loading,
    error
  };
};