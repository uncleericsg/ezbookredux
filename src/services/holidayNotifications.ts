import { addDays, startOfDay, parseISO, isValid } from 'date-fns';
import { z } from 'zod';
import type { Holiday } from '../types';
import { fetchPublicHolidays } from './publicHolidays';

const NOTIFICATION_WINDOW = 30; // days
const SUPPORTED_LOCALES = ['en', 'zh', 'ms', 'ta'] as const;

export class HolidayNotificationService {
  private static instance: HolidayNotificationService;
  private holidays: Map<string, Holiday> = new Map();

  private constructor() {}

  public static getInstance(): HolidayNotificationService {
    if (!HolidayNotificationService.instance) {
      HolidayNotificationService.instance = new HolidayNotificationService();
    }
    return HolidayNotificationService.instance;
  }

  public async getUpcomingHolidays(): Promise<Holiday[]> {
    try {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      
      const [currentYearHolidays, nextYearHolidays] = await Promise.all([
        fetchPublicHolidays(currentYear),
        fetchPublicHolidays(nextYear)
      ]);

      const today = startOfDay(new Date());
      const futureDate = addDays(today, NOTIFICATION_WINDOW);
      
      return [...currentYearHolidays, ...nextYearHolidays]
        .filter(holiday => {
          const holidayDate = parseISO(holiday.date);
          return isValid(holidayDate) && 
                 holidayDate >= today && 
                 holidayDate <= futureDate;
        })
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    } catch (error) {
      console.error('Failed to fetch upcoming holidays:', error);
      throw error;
    }
  }

  public async validateHoliday(holiday: Holiday): Promise<boolean> {
    const holidayDate = parseISO(holiday.date);
    if (!isValid(holidayDate)) return false;

    const today = startOfDay(new Date());
    const futureDate = addDays(today, NOTIFICATION_WINDOW);
    
    return holidayDate >= today && holidayDate <= futureDate;
  }
}

export const holidayNotificationService = HolidayNotificationService.getInstance();