import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAvailableSlots } from '../services/acuity';
import { format, addMinutes, isBefore, isAfter } from 'date-fns';
import { withRetry } from '../utils/retry';
import { useAcuitySettings } from './useAcuitySettings';
import { toast } from 'sonner';
import type { TimeSlot, FetchError } from '../types';
import { categoryMapper } from '../services/categoryMapping';
import { validateTimeSlot } from '../utils/bookingValidation';
import type { AcuityAppointmentType } from '../services/acuityIntegration';

const CACHE_DURATION = 30000; // 30 seconds cache
const CACHE_KEY_FORMAT = 'yyyy-MM-dd';

export const useTimeSlots = (
  selectedDate: Date | null, 
  categoryId?: string,
  isAMC = false,
  appointmentType?: AcuityAppointmentType
) => {
  const { getAppointmentType } = useAcuitySettings();
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
    const validation = validateTimeSlot(slot, isAMC, [], appointmentType);
    return validation.isValid;
  }, [isAMC, appointmentType]);

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
      let availableSlots = await withRetry(
        () => fetchAvailableSlots(
          selectedDate, 
          categoryId,
          appointmentType,
          appointmentType,
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

  // Validate appointment type on mount
  useEffect(() => {
    if (categoryId && !appointmentType) {
      setError('Invalid service type configuration');
      toast.error('Service type not properly configured');
    }
  }, [categoryId, appointmentType]);
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

  // Validate appointment type on mount
  useEffect(() => {
    if (categoryId && !appointmentType) {
      setError('Invalid service type configuration');
      toast.error('Service type not properly configured');
    }
  }, [categoryId, appointmentType]);

  return {
    slots,
    loading,
    error
  };
};