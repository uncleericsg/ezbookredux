export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'service_reminder' | 'amc_expiry' | 'appointment_confirmation';
  priority: 'high' | 'normal' | 'low';
  actionUrl?: string;
  createdAt: string;
  read: boolean;
}

export interface HolidayGreeting {
  id: string;
  holiday: string;
  date: string;
  message: string;
  enabled: boolean;
  sendTime: string;
  lastModified?: string;
}