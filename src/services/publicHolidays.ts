import { logger } from '@/lib/logger';
import { handleNotFoundError } from '@/utils/apiErrors';
import { supabaseClient } from '@/config/supabase/client';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  isWorkingDay: boolean;
  dayOfWeek: number;
}

export async function getPublicHolidays(year: number): Promise<Holiday[]> {
  logger.info('Fetching public holidays', { year });

  const { data, error } = await supabaseClient
    .from('holidays')
    .select()
    .eq('year', year);

  if (error) {
    logger.error('Failed to fetch public holidays', {
      message: error.message,
      details: { year }
    });
    throw error;
  }

  if (!data?.length) {
    throw handleNotFoundError(`No public holidays found for year ${year}`);
  }

  return data.map(holiday => ({
    id: holiday.id,
    name: holiday.name,
    date: holiday.date,
    type: holiday.type,
    isWorkingDay: holiday.is_working_day,
    dayOfWeek: new Date(holiday.date).getDay()
  }));
}

export function isPublicHoliday(date: Date, holidays: Holiday[]): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.some(holiday => holiday.date === dateStr);
}

export function getNextWorkingDay(date: Date, holidays: Holiday[]): Date {
  let nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  while (isPublicHoliday(nextDay, holidays) || nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}