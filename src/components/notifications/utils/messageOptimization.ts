import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { MessageFormData } from './messageValidation';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  return useCallback(
    debounce((...args: Parameters<T>) => callback(...args), delay),
    [callback, delay]
  );
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  const timeout = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - (now - lastRun.current));
      }
    },
    [callback, delay]
  ) as T;
}

export function useMemoizedFormData(formData: MessageFormData) {
  return useMemo(() => ({
    ...formData,
    processedUrl: formData.url ? new URL(formData.url).toString() : '',
    isValid: true, // Add validation logic here
  }), [
    formData.content,
    formData.url,
    formData.scheduledDate,
    formData.scheduledTime,
    formData.frequency,
    formData.userType,
  ]);
}

export function useMessageAnalytics() {
  const trackMessageScheduled = useCallback((message: MessageFormData) => {
    // Implement your analytics tracking here
    console.log('Message scheduled:', message);
  }, []);

  const trackMessagePreview = useCallback((message: MessageFormData) => {
    // Implement your analytics tracking here
    console.log('Message previewed:', message);
  }, []);

  const trackError = useCallback((error: Error) => {
    // Implement your error tracking here
    console.error('Message error:', error);
  }, []);

  return {
    trackMessageScheduled,
    trackMessagePreview,
    trackError,
  };
}

export function usePerformanceMonitoring() {
  const startTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime.current;
      // Implement your performance monitoring here
      console.log('Component lifetime:', duration);
    };
  }, []);

  const measureOperation = useCallback((operation: string, callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`Operation ${operation} took ${end - start}ms`);
  }, []);

  return {
    measureOperation,
  };
}

export function useMessageCache() {
  const cache = useRef(new Map<string, MessageFormData>());

  const setCached = useCallback((key: string, data: MessageFormData) => {
    cache.current.set(key, data);
  }, []);

  const getCached = useCallback((key: string) => {
    return cache.current.get(key);
  }, []);

  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  return {
    setCached,
    getCached,
    clearCache,
  };
}
