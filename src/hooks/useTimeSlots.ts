import { useState, useEffect, useRef, useCallback } from 'react';
import { format, addMinutes, isBefore, isAfter } from 'date-fns';
import { withRetry } from '@utils/retry';
import { toast } from 'sonner';
import { categoryMapper } from '@services/categoryMapping';
import { validateTimeSlot } from '@utils/bookingValidation';

interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
  duration: number;
}

interface FetchError extends Error {
  status?: number;
}

const CACHE_DURATION = 30000; // 30 seconds cache
const CACHE_KEY_FORMAT = 'yyyy-MM-dd';

// Local implementation of time slot fetching
const fetchAvailableSlots = async (
  date: Date,
  categoryId: string,
  signal?: AbortSignal
): Promise<TimeSlot[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const slots: TimeSlot[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(9, 30, 0, 0);
  const isFriday = date.getDay() === 5;
  const endHour = isFriday ? 16.5 : 17;
  const isAMC = categoryId === 'amc';
  const slotDuration = isAMC ? 90 : 60;

  // Generate slots
  for (let i = 0; i < 8; i++) {
    const slotTime = addMinutes(baseDate, i * slotDuration);
    const hour = slotTime.getHours();
    const minutes = slotTime.getMinutes();

    // Skip slots outside business hours
    if (hour < 9.5) continue;
    if (isFriday && (hour > 16 || (hour === 16 && minutes > 30))) continue;
    if (!isFriday && hour >= 17) continue;

    slots.push({
      id: `slot-${i}`,
      datetime: slotTime.toISOString(),
      available: Math.random() > 0.3,
      duration: slotDuration
    });
  }

  return slots;
};

export const useTimeSlots = (
  selectedDate: Date | null, 
  categoryId?: string,
  isAMC = false
) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slotsCache = useRef<Map<string, { slots: TimeSlot[]; timestamp: number; categoryId: string }>>(new Map());
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const getCachedSlots = useCallback((date: Date, category: string): TimeSlot[] | null => {
    const cacheKey = format(date, CACHE_KEY_FORMAT);
    const cached = slotsCache.current.get(cacheKey);
    
    if (cached && 
        Date.now() - cached.timestamp < CACHE_DURATION &&
        cached.categoryId === category) {
      return cached.slots;
    }
    return null;
  }, []);

  const setCachedSlots = useCallback((date: Date, slots: TimeSlot[], category: string) => {
    const cacheKey = format(date, CACHE_KEY_FORMAT);
    slotsCache.current.set(cacheKey, {
      slots,
      timestamp: Date.now(),
      categoryId: category
    });
  }, []);

  const validateSlot = useCallback((slot: TimeSlot): boolean => {
    const validation = validateTimeSlot(slot, isAMC);
    return validation.isValid;
  }, [isAMC]);

  const loadSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedDate || !categoryId) {
        setSlots([]);
        return;
      }

      const cachedSlots = getCachedSlots(selectedDate, categoryId);
      if (cachedSlots) {
        setSlots(cachedSlots);
        return;
      }

      const controller = new AbortController();
      const availableSlots = await withRetry(
        () => fetchAvailableSlots(
          selectedDate, 
          categoryId,
          controller.signal
        ),
        {
          maxAttempts: 3,
          delayMs: 1000,
          onRetry: (attempt, max) => {
            toast.loading(`Retrying... (${attempt}/${max})`);
          }
        }
      );

      if (availableSlots.length === 0) {
        setError('No available time slots for this date');
      } else {
        setSlots(availableSlots);
        setCachedSlots(selectedDate, availableSlots, categoryId);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;

      const error = err as FetchError;
      console.error('Error loading time slots:', error);

      if (error.status === 429) {
        toast.error('Too many requests. Please try again in a moment.');
        setError('Rate limit exceeded. Please try again in a moment.');
      } else {
        setSlots([]); 
        setError(error.message || 'Failed to load available time slots');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDate, categoryId, getCachedSlots, setCachedSlots, validateSlot]);

  useEffect(() => {
    if (!selectedDate || !categoryId) {
      setSlots([]);
      setError(null);
      return;
    }

    loadSlots();
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [selectedDate, categoryId, loadSlots]);

  return {
    slots,
    loading,
    error
  };
};