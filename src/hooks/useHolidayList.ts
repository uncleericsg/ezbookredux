import { useState, useEffect, useCallback } from 'react';
import { fetchPublicHolidays } from '../services/publicHolidays';
import { addDays, startOfDay, parseISO } from 'date-fns';
import type { Holiday } from '../types';
import { toast } from 'sonner';

export const useHolidayList = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        
        // Fetch holidays for current and next year
        const [currentYearHolidays, nextYearHolidays] = await Promise.all([
          fetchPublicHolidays(currentYear),
          fetchPublicHolidays(nextYear)
        ]);

        // Filter and sort upcoming holidays
        const today = startOfDay(new Date());
        const futureDate = addDays(today, 90); // Next 90 days
        
        const upcomingHolidays = [...currentYearHolidays, ...nextYearHolidays]
          .filter(holiday => {
            const holidayDate = parseISO(holiday.date);
            return holidayDate >= today && holidayDate <= futureDate;
          })
          .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

        setHolidays(upcomingHolidays);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load holidays';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
  }, []);

  const refreshHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const holidays = await fetchPublicHolidays(currentYear);
      setHolidays(holidays);
    } catch (error) {
      console.error('Failed to refresh holidays:', error);
      toast.error('Failed to refresh holidays');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    holidays,
    loading,
    error,
    refreshHolidays
  };
};