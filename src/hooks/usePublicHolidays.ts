import { useState, useEffect } from 'react';
import { fetchPublicHolidays } from '@services/publicHolidays';
import { addDays, startOfDay } from 'date-fns';

export interface Holiday {
  date: string;
  name: string;
  dayOfWeek: string;
}

export const usePublicHolidays = () => {
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        
        // Fetch holidays for current and next year
        const [currentYearHolidays, nextYearHolidays] = await Promise.all([
          fetchPublicHolidays(currentYear),
          fetchPublicHolidays(nextYear)
        ]);

        // Combine and sort holidays
        const allHolidays = [...currentYearHolidays, ...nextYearHolidays]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Filter to next 365 days
        const today = startOfDay(new Date());
        const yearFromNow = addDays(today, 365);
        
        const upcomingHolidays = allHolidays.filter(holiday => {
          const holidayDate = new Date(holiday.date);
          return holidayDate >= today && holidayDate <= yearFromNow;
        });

        // Convert to Set for O(1) lookup
        const holidaySet = new Set(upcomingHolidays.map(h => h.date));
        setHolidays(holidaySet);

      } catch (err) {
        setError('Failed to load public holidays');
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
    
    // Update daily
    const dailyUpdate = setInterval(loadHolidays, 24 * 60 * 60 * 1000);
    return () => clearInterval(dailyUpdate);
  }, []);

  return { holidays, loading, error };
};