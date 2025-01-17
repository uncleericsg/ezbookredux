export interface Holiday {
  id: string;
  date: string;
  name: string;
  holiday: string;
  dayOfWeek: string;
  type: 'public' | 'bank' | 'observance';
  isWorkingDay: boolean;
}

export interface HolidayResponse {
  success: boolean;
  data?: Holiday[];
  error?: string;
}

export interface HolidayNotification {
  id: string;
  holidayId: string;
  userId: string;
  type: 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'failed';
  scheduledFor: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface HolidayGreeting {
  id: string;
  holidayId: string;
  message: string;
  template: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 