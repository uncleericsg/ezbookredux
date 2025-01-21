import { APIError } from '@/utils/apiErrors';
import type { HolidayGreeting } from '@/types/holiday';
import type { ChatGPTSettings } from '@/types/settings';
import { supabaseClient } from '@/config/supabase/client';

export async function fetchHolidayGreetings(): Promise<HolidayGreeting[]> {
  try {
    const { data, error } = await supabaseClient
      .from('holiday_greetings')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new APIError(
      'FETCH_GREETINGS_ERROR',
      'Failed to fetch holiday greetings',
      500,
      { error }
    );
  }
}

export async function updateHolidayGreeting(
  greeting: HolidayGreeting
): Promise<HolidayGreeting> {
  try {
    const { data, error } = await supabaseClient
      .from('holiday_greetings')
      .update(greeting)
      .eq('id', greeting.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new APIError(
      'UPDATE_GREETING_ERROR',
      'Failed to update holiday greeting',
      500,
      { error }
    );
  }
}

export async function generateHolidayGreeting(
  holiday: string,
  date: string,
  tone: 'formal' | 'casual' = 'formal',
  language: string = 'en',
  settings: ChatGPTSettings
): Promise<string> {
  try {
    const response = await fetch('/api/greetings/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        holiday,
        date,
        tone,
        language,
        settings
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    throw new APIError(
      'GENERATE_GREETING_ERROR',
      'Failed to generate holiday greeting',
      500,
      { error }
    );
  }
}

export async function scheduleHolidayGreetings(
  greetings: HolidayGreeting[],
  scheduleTime: '12h' | '24h' | '48h' = '24h',
  options?: {
    sendTwiceDaily?: boolean;
    morningTime?: string;
    eveningTime?: string;
  }
): Promise<void> {
  try {
    const response = await fetch('/api/greetings/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        greetings,
        scheduleTime,
        options
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    throw new APIError(
      'SCHEDULE_GREETINGS_ERROR',
      'Failed to schedule holiday greetings',
      500,
      { error }
    );
  }
}
