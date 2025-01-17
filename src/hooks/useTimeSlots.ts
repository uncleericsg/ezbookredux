import { useState, useEffect, useCallback, useRef } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { TimeSlot } from '@shared/types/booking';
import { getAvailableSlots } from '@/services/bookingService';
import { logger } from '@/utils/logger';

export const useTimeSlots = (date: Date, region: string) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      const availableSlots = await getAvailableSlots({
        startDate: startOfDay(date),
        endDate: addDays(startOfDay(date), 1),
        region
      });
      setSlots(availableSlots);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch time slots'));
      logger.error('Failed to fetch time slots:', { error: err });
    } finally {
      setLoading(false);
    }
  }, [date, region]);

  useEffect(() => {
    fetchSlots();
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchSlots]);

  return {
    slots,
    loading,
    error,
    refetch: fetchSlots
  };
};