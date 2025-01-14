import { useState, useCallback, useRef } from 'react';
import type { TimeSlot } from '@types';
import type { Region } from '@services/locations/regions';
import { useLocationOptimizer } from '@hooks/useLocationOptimizer';
import { cacheWarmer } from '@utils/cache';
import { isRateLimitError, isNetworkError } from '@types/errors';

const BATCH_SIZE = 10;
const RATE_LIMIT_DELAY = 1000;
const MAX_RETRIES = 3;

interface UseProgressiveLoadingOptions {
  initialSlots?: TimeSlot[];
  address: string;
  date: Date | null;
  isAMC?: boolean;
}

export const useProgressiveLoading = ({
  initialSlots = [],
  address,
  date,
  isAMC = false
}: UseProgressiveLoadingOptions) => {
  const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const retryCount = useRef(0);
  const currentBatch = useRef(0);

  const { optimize } = useLocationOptimizer({
    address,
    date,
    slots: initialSlots,
    isAMC
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !date) return;
    setLoading(true);
    
    try {
      const start = currentBatch.current * BATCH_SIZE;
      const end = start + BATCH_SIZE;
      
      // Optimistically update UI
      const placeholderSlots = Array.from({ length: BATCH_SIZE }).map((_, i) => ({
        id: `placeholder-${start + i}`,
        datetime: new Date(date).toISOString(),
        loading: true
      })) as TimeSlot[];
      
      setSlots(prev => [...prev, ...placeholderSlots]);

      // Start background cache warming for next regions
      const nextRegions = ['north', 'south', 'east', 'west'] as Region[];
      cacheWarmer.warmCache(nextRegions, date).catch(console.error);

      // Actual optimization
      const result = await optimize();
      const newSlots = result.slots.slice(start, end);

      if (newSlots.length < BATCH_SIZE) {
        setHasMore(false);
      }

      setSlots(prev => 
        prev.map(slot => 
          slot.loading ? newSlots.shift() || slot : slot
        )
      );

      currentBatch.current++;
      retryCount.current = 0;
      setError(null);

    } catch (err) {
      const error = err as Error;
      
      if (isRateLimitError(error)) {
        // Handle rate limiting
        setTimeout(() => {
          loadMore();
        }, RATE_LIMIT_DELAY);
        return;
      }

      if (isNetworkError(error)) {
        // Handle offline state
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current++;
          setTimeout(() => {
            loadMore();
          }, Math.pow(2, retryCount.current) * 1000);
          return;
        }
      }

      setError(error);
      // Remove placeholder slots on error
      setSlots(prev => prev.filter(slot => !slot.loading));
    } finally {
      setLoading(false);
    }
  }, [date, hasMore, loading, optimize]);

  const reset = useCallback(() => {
    setSlots(initialSlots);
    setLoading(false);
    setError(null);
    setHasMore(true);
    currentBatch.current = 0;
    retryCount.current = 0;
  }, [initialSlots]);

  return {
    slots,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};
