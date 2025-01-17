import { addDays, startOfDay, format, parse } from 'date-fns';
import { logger } from '@/utils/logger';
import { ErrorMetadata } from '@/types/error';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'religious' | 'cultural';
  isWorkingDay: boolean;
}

interface HolidayNotification {
  id: string;
  holidayId: string;
  userId: string;
  type: 'reminder' | 'greeting';
  status: 'scheduled' | 'sent' | 'failed';
  scheduledFor: string;
  sentAt?: string;
}

export async function getUpcomingHolidays(): Promise<Holiday[]> {
  try {
    const today = startOfDay(new Date());
    const nextMonth = addDays(today, 30);

    const holidays = await fetch('/api/holidays').then(res => res.json());

    return holidays.filter((holiday: Holiday) => {
      const holidayDate = parse(holiday.date, 'yyyy-MM-dd', new Date());
      return holidayDate >= today && holidayDate <= nextMonth;
    });
  } catch (error) {
    logger.error('Failed to fetch upcoming holidays', error as ErrorMetadata);
    return [];
  }
}

export async function scheduleHolidayNotifications(userId: string, holidays: Holiday[]): Promise<void> {
  try {
    for (const holiday of holidays) {
      const holidayDate = parse(holiday.date, 'yyyy-MM-dd', new Date());
      const reminderDate = addDays(holidayDate, -2);

      await createHolidayNotification({
        holidayId: holiday.id,
        userId,
        type: 'reminder',
        status: 'scheduled',
        scheduledFor: format(reminderDate, 'yyyy-MM-dd')
      });

      await createHolidayNotification({
        holidayId: holiday.id,
        userId,
        type: 'greeting',
        status: 'scheduled',
        scheduledFor: format(holidayDate, 'yyyy-MM-dd')
      });
    }
  } catch (error) {
    logger.error('Failed to schedule holiday notifications', error as ErrorMetadata);
  }
}

async function createHolidayNotification(notification: Omit<HolidayNotification, 'id'>): Promise<void> {
  try {
    await fetch('/api/notifications/holiday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
  } catch (error) {
    logger.error('Failed to create holiday notification', error as ErrorMetadata);
  }
}