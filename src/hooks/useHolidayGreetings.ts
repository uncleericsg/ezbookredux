import { useState, useCallback, useEffect } from 'react';
import { 
  generateHolidayGreeting, 
  scheduleHolidayGreetings, 
  fetchHolidayGreetings, 
  updateHolidayGreeting 
} from '@/services/notifications';
import type { Holiday, HolidayGreeting } from '@/types/holiday';
import type { ChatGPTSettings } from '@/types/settings';
import { APIError } from '@/utils/apiErrors';
import { toast } from 'sonner';

interface UseHolidayGreetingsOptions {
  chatGPTSettings?: ChatGPTSettings;
}

interface UseHolidayGreetingsResult {
  holidayGreetings: HolidayGreeting[];
  loading: boolean;
  error: string | null;
  generateGreeting: (
    holiday: string,
    date: string,
    tone?: 'formal' | 'casual',
    language?: string
  ) => Promise<string | null>;
  updateGreeting: (greeting: HolidayGreeting) => Promise<HolidayGreeting>;
  scheduleGreetings: (
    greetings: HolidayGreeting[],
    scheduleTime?: '12h' | '24h' | '48h',
    options?: {
      sendTwiceDaily?: boolean;
      morningTime?: string;
      eveningTime?: string;
    }
  ) => Promise<void>;
}

export const useHolidayGreetings = (
  options: UseHolidayGreetingsOptions = {}
): UseHolidayGreetingsResult => {
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
        const message = err instanceof APIError ? err.message : 'Failed to load greetings';
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
  ): Promise<string | null> => {
    if (!options.chatGPTSettings?.enabled) {
      const error = new APIError(
        'CHATGPT_DISABLED',
        'ChatGPT integration is not enabled',
        400
      );
      setError(error.message);
      toast.error(error.message);
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
      const error = err instanceof APIError ? err : new APIError(
        'GENERATION_ERROR',
        'Failed to generate greeting',
        500,
        { originalError: err }
      );
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.chatGPTSettings]);

  const updateGreeting = useCallback(async (
    greeting: HolidayGreeting
  ): Promise<HolidayGreeting> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!greeting.message?.trim()) {
        throw new APIError(
          'INVALID_MESSAGE',
          'Greeting message cannot be empty',
          400
        );
      }

      const updatedGreeting = await updateHolidayGreeting(greeting);
      setHolidayGreetings(prev => 
        prev.map(g => g.id === greeting.id ? updatedGreeting : g)
      );
      setLastUpdate(new Date());
      toast.success('Holiday greeting updated');
      return updatedGreeting;
    } catch (err) {
      const error = err instanceof APIError ? err : new APIError(
        'UPDATE_ERROR',
        'Failed to update greeting',
        500,
        { originalError: err }
      );
      setError(error.message);
      toast.error(error.message);
      throw error;
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
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await scheduleHolidayGreetings(greetings, scheduleTime, options);
      toast.success('Greetings scheduled successfully');
    } catch (err) {
      const error = err instanceof APIError ? err : new APIError(
        'SCHEDULE_ERROR',
        'Failed to schedule greetings',
        500,
        { originalError: err }
      );
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    holidayGreetings,
    loading,
    error,
    generateGreeting,
    updateGreeting,
    scheduleGreetings
  };
};