import { useState, useEffect } from 'react';
import { useToast } from '@hooks/useToast';

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderDays: number;
}

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: true,
    push: true,
    reminderDays: 7,
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // In a real app, this would fetch from an API
        const savedPreferences = localStorage.getItem('notificationPreferences');
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        toast.showError('Failed to load notification preferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      toast.showSuccess('Notification preferences updated');
    } catch (error) {
      toast.showError('Failed to update preferences');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
  };
};