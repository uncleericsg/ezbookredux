import axios from 'axios';
import { addDays } from 'date-fns';
import { chatGPTService } from './chatgpt';
import { getUserDetails } from './users';
import { fetchPublicHolidays } from './publicHolidays';
import { toast } from 'sonner';
import type { PushTemplate } from '@types/notifications';

const validateTemplateContent = (content: string): boolean => {
  if (!content.trim()) return false;
  if (content.length > 4096) return false;
  
  // Check for required placeholders
  const requiredPlaceholders = ['{first_name}'];
  return requiredPlaceholders.every(p => content.includes(p));
};

export const validatePushTemplate = (template: PushTemplate): boolean => {
  // Validate required fields
  if (!template.title?.trim()) {
    toast.error('Template title is required');
    return false;
  }

  if (!validateTemplateContent(template.content)) {
    toast.error('Invalid template content. Must include {first_name} placeholder');
    return false;
  }

  // Validate URL if present
  if (template.url && !isValidUrl(template.url)) {
    toast.error('Invalid action URL format');
    return false;
  }

  // Validate media URLs if present
  if (template.media?.image && !isValidUrl(template.media.image)) {
    toast.error('Invalid image URL');
    return false;
  }

  if (template.media?.video && !isValidUrl(template.media.video)) {
    toast.error('Invalid video URL');
    return false;
  }

  // Validate schedule if present
  if (template.schedule) {
    const { startDate, endDate } = template.schedule;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date');
      return false;
    }
  }

  return true;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
import type { Notification, HolidayGreeting } from '@types';

export const sendServiceNotification = async (
  userId: string,
  templateId: string,
  data: Record<string, any>
): Promise<void> => {
  try {
    if (import.meta.env.DEV) {
      console.log('Would send notification:', { userId, templateId, data });
      return;
    }

    await axios.post('/api/notifications/send', {
      userId,
      templateId,
      data
    });
  } catch (error) {
    console.error('Failed to send service notification:', error);
    toast.error('Failed to send notification');
    throw error;
  }
};

export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  if (import.meta.env.DEV) {
    return [
      {
        id: '1',
        userId,
        title: 'Service Due Soon',
        message: 'Your next service is due in 7 days',
        type: 'service_reminder',
        priority: 'high',
        actionUrl: '/schedule',
        createdAt: new Date().toISOString(),
        read: false,
      }
    ];
  }

  try {
    const response = await axios.get(`/api/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  try {
    await axios.put(`/api/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

export const scheduleServiceReminder = async (
  userId: string,
  date: Date,
  type: 'service_reminder' | 'amc_expiry',
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const user = await getUserDetails(userId);
    const isAmc = user.lastName.toLowerCase().includes('amc');
    const reminderDays = isAmc ? 75 : 90;
    
    const reminderDate = addDays(date, -reminderDays);

    await axios.post('/api/notifications/schedule', {
      userId,
      date: reminderDate.toISOString(),
      type,
      metadata: {
        intervalDays: reminderDays,
        isAmc,
        nextServiceDate: date.toISOString(),
        ...metadata,
      },
    });

    if (isAmc) {
      // Schedule urgent reminder for AMC customers
      const urgentReminderDate = addDays(date, -30);
      await axios.post('/api/notifications/schedule', {
        userId,
        date: urgentReminderDate.toISOString(),
        type: 'service_reminder',
        metadata: {
          intervalDays: 30,
          isAmc,
          nextServiceDate: date.toISOString(),
          urgent: true,
          ...metadata,
        },
      });
    }
  } catch (error) {
    console.error('Failed to schedule reminder:', error);
    throw error;
  }
};

export const scheduleCustomMessage = async (schedule: {
  message: string;
  scheduledDate: string;
  userType: 'all' | 'amc' | 'regular';
}): Promise<void> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Would schedule message:', schedule);
    return;
  }

  try {
    await axios.post('/api/notifications/schedule-custom', schedule);
  } catch (error) {
    console.error('Failed to schedule custom message:', error);
    throw error;
  }
};

export const fetchHolidayGreetings = async (): Promise<HolidayGreeting[]> => {
  const publicHolidays = await fetchPublicHolidays();
  
  // In development, return mock data
  if (import.meta.env.DEV) return publicHolidays.map(holiday => ({
    id: holiday.date,
    holiday: holiday.name,
    date: holiday.date,
    message: `Happy ${holiday.name}! Our office will be closed on ${new Date(holiday.date).toLocaleDateString()}. For emergencies, please contact 9187 4498.`,
    enabled: true,
    sendTime: `${holiday.date}T09:00:00Z`
  }));

  try {
    const response = await axios.get('/api/notifications/holiday-greetings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch holiday greetings:', error);
    throw error;
  }
};

export const updateHolidayGreeting = async (greeting: HolidayGreeting): Promise<HolidayGreeting> => {
  if (import.meta.env.DEV) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      ...greeting,
      lastModified: new Date().toISOString()
    };
  }

  try {
    const response = await axios.put(`/api/notifications/holiday-greetings/${greeting.id}`, greeting);
    return response.data;
  } catch (error) {
    console.error('Failed to update holiday greeting:', error);
    throw error;
  }
};

export const deleteHolidayGreeting = async (id: string): Promise<void> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  try {
    await axios.delete(`/api/notifications/holiday-greetings/${id}`);
  } catch (error) {
    console.error('Failed to delete holiday greeting:', error);
    throw error;
  }
};