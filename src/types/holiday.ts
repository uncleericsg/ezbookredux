export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'religious' | 'cultural';
  description?: string;
}

export interface HolidayGreeting {
  id: string;
  holiday: string;
  date: string;
  message: string;
  enabled: boolean;
  sendTime: string;
  lastSent?: string;
  status?: 'pending' | 'sent' | 'failed';
}

export interface HolidaySchedule {
  holiday: Holiday;
  greeting?: HolidayGreeting;
  nextOccurrence: string;
}

export const holidaySchema = {
  type: ['public', 'religious', 'cultural'] as const,
  status: ['pending', 'sent', 'failed'] as const
};