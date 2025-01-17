import type { Notification, NotificationPreferences } from '@/types/notifications';
import { logger } from '@/utils/logger';
import { ErrorMetadata } from '@/types/error';

export async function sendNotification(notification: Notification): Promise<void> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }
  } catch (error) {
    logger.error('Error sending notification:', error as ErrorMetadata);
    throw error;
  }
}

export async function updateNotificationPreferences(
  userId: string, 
  preferences: NotificationPreferences
): Promise<NotificationPreferences> {
  try {
    const response = await fetch(`/api/users/${userId}/notification-preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });

    if (!response.ok) {
      throw new Error(`Failed to update notification preferences: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error('Error updating notification preferences:', error as ErrorMetadata);
    throw error;
  }
}

export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  try {
    const response = await fetch(`/api/users/${userId}/notification-preferences`);
    
    if (!response.ok) {
      throw new Error(`Failed to get notification preferences: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error('Error getting notification preferences:', error as ErrorMetadata);
    throw error;
  }
}