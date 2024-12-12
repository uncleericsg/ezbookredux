import { useState, useEffect, useCallback } from 'react';
import { holidayNotificationService } from '../services/holidayNotifications';
import type { Holiday } from '../types';
import { toast } from 'sonner';

export const useHolidayNotifications = () => {
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHolidays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const holidays = await holidayNotificationService.getUpcomingHolidays();
      setUpcomingHolidays(holidays);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load holidays';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHolidays();
    
    // Refresh data every hour
    const interval = setInterval(loadHolidays, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadHolidays]);

  return {
    upcomingHolidays,
    loading,
    error,
    refresh: loadHolidays
  };
};