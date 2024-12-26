import { useState, useCallback, useEffect } from 'react';
import { generateHolidayGreeting, scheduleHolidayGreetings, fetchHolidayGreetings, updateHolidayGreeting } from '@services/notifications';
import type { HolidayGreeting } from '@types';
import type { ChatGPTSettings } from '@types/settings';
import { toast } from 'sonner';

interface UseHolidayGreetingsOptions {
  chatGPTSettings?: ChatGPTSettings;
}

export const useHolidayGreetings = (options: UseHolidayGreetingsOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holidayGreetings, setHolidayGreetings] = useState<HolidayGreeting[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const loadGreetings = async () => {
      try {
        setLoading(true);
        setError(null);
        const greetings = await fetchHolidayGreetings();
        setHolidayGreetings(greetings);
        setLastUpdate(new Date());
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load greetings';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadGreetings();
  }, [lastUpdate]);

  const generateGreeting = useCallback(async (
    holiday: string,
    date: string,
    tone: 'formal' | 'casual' = 'formal',
    language: string = 'en'
  ) => {
    if (!options.chatGPTSettings?.enabled) {
      toast.error('ChatGPT integration is not enabled');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const message = await generateHolidayGreeting(
        holiday,
        date,
        tone,
        language,
        options.chatGPTSettings
      );
      return message;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate greeting';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.chatGPTSettings]);

  const updateGreeting = useCallback(async (greeting: HolidayGreeting) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!greeting.message?.trim()) {
        throw new Error('Greeting message cannot be empty');
      }

      const updatedGreeting = await updateHolidayGreeting(greeting);
      setHolidayGreetings(prev => 
        prev.map(g => g.id === greeting.id ? updatedGreeting : g)
      );
      setLastUpdate(new Date());
      toast.success('Holiday greeting updated');
      return updatedGreeting;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update greeting';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleGreetings = useCallback(async (
    greetings: HolidayGreeting[],
    scheduleTime: '12h' | '24h' | '48h' = '24h',
    options?: {
      sendTwiceDaily?: boolean;
      morningTime?: string;
      eveningTime?: string;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      await scheduleHolidayGreetings(greetings, scheduleTime, options);
      toast.success('Greetings scheduled successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule greetings';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    holidayGreetings,
    loading,
    error,
    generateGreeting,
    updateGreeting
  };
};