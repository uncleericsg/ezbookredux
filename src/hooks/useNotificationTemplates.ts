import { useState, useEffect, useCallback, useRef } from 'react';
import { updateHolidayGreeting, deleteHolidayGreeting } from '@services/notifications';
import { fetchPublicHolidays } from '@services/publicHolidays';
import { parseISO, isValid, addDays, startOfDay, isBefore, isAfter } from 'date-fns';
import type { HolidayGreeting } from '@types';
import { toast } from 'sonner';

const DAYS_AHEAD = 90;

export const useNotificationTemplates = () => {
  const [holidayGreetings, setHolidayGreetings] = useState<HolidayGreeting[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Load holiday greetings
  const loadGreetings = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      
      // Fetch holidays for current and next year
      const [currentYearHolidays, nextYearHolidays] = await Promise.all([
        fetchPublicHolidays(currentYear),
        fetchPublicHolidays(nextYear)
      ]);
      
      // Filter and transform holidays into greetings format
      const today = startOfDay(new Date());
      const futureDate = addDays(today, DAYS_AHEAD);
      
      const upcomingHolidays = [...currentYearHolidays, ...nextYearHolidays]
        .filter(holiday => {
          const holidayDate = parseISO(holiday.date);
          return isValid(holidayDate) && 
                 !isBefore(holidayDate, today) && 
                 !isAfter(holidayDate, futureDate);
        })
        .map(holiday => ({
          id: holiday.date,
          holiday: holiday.name,
          date: holiday.date,
          message: '',
          enabled: true,
          sendTime: `${holiday.date}T09:00:00Z`
        }));
      
      if (isMounted.current) {
        setHolidayGreetings(upcomingHolidays);
      }
    } catch (error) {
      console.error('Failed to load holiday greetings:', error);
      if (isMounted.current) {
        toast.error('Failed to load holiday greetings');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    loadGreetings();
  }, [loadGreetings]);

  const updateGreeting = async (greeting: HolidayGreeting) => {
    try {
      const updatedGreeting = await updateHolidayGreeting(greeting);
      setHolidayGreetings(prev =>
        prev.map(g => g.id === greeting.id ? updatedGreeting : g)
      );
      toast.success('Holiday greeting updated');
    } catch (error) {
      toast.error('Failed to update greeting');
      throw error;
    }
  };

  const deleteGreeting = async (id: string) => {
    try {
      await deleteHolidayGreeting(id);
      setHolidayGreetings(prev => prev.filter(g => g.id !== id));
      toast.success('Holiday greeting deleted');
    } catch (error) {
      toast.error('Failed to delete greeting');
      throw error;
    }
  };

  const addGreeting = async (greeting: HolidayGreeting) => {
    try {
      const holidayDate = parseISO(greeting.date);
      const today = startOfDay(new Date());
      const futureDate = addDays(today, DAYS_AHEAD);
      
      if (!isValid(holidayDate)) {
        toast.error('Invalid date');
        return;
      }
      
      if (isBefore(holidayDate, today)) {
        toast.error('Cannot add past holidays');
        return;
      }
      
      if (isAfter(holidayDate, futureDate)) {
        toast.error(`Cannot add holidays more than ${DAYS_AHEAD} days ahead`);
        return;
      }

      const newGreeting = await updateHolidayGreeting(greeting);
      setHolidayGreetings(prev => [...prev, newGreeting]);
      toast.success('Holiday greeting added');
    } catch (error) {
      toast.error('Failed to add greeting');
      throw error;
    }
  };

  const getUpcomingHolidays = useCallback(() => {
    const today = startOfDay(new Date());
    const futureDate = addDays(today, DAYS_AHEAD);
    return holidayGreetings.filter(greeting => {
      try {
        const holidayDate = parseISO(greeting.date);
        return isValid(holidayDate) && !isBefore(holidayDate, today) && !isAfter(holidayDate, futureDate);
      } catch {
        return false;
      }
    }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  }, [holidayGreetings]);

  return {
    holidayGreetings,
    loading,
    updateGreeting,
    deleteGreeting,
    addGreeting,
    getUpcomingHolidays
  };
};