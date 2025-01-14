import { useState, useEffect } from 'react';
import { addDays, isBefore } from 'date-fns';
import { useUser } from '@contexts/UserContext';
import { scheduleServiceReminder } from '@services/notifications';
import { useToast } from '@hooks/useToast';

export const useServiceReminders = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!user?.nextServiceDate) return;

    const scheduleReminders = async () => {
      try {
        setLoading(true);
        const nextService = new Date(user.nextServiceDate);
        const reminderDate = addDays(nextService, -7); // Fixed 7-day reminder

        if (isBefore(new Date(), reminderDate)) {
          await scheduleServiceReminder(user.id, reminderDate, 'service_reminder');
        }

        // Schedule AMC expiry reminder if applicable
        if (user.amcStatus === 'active') {
          const expiryDate = addDays(nextService, -30);
          if (isBefore(new Date(), expiryDate)) {
            await scheduleServiceReminder(user.id, expiryDate, 'amc_expiry');
          }
        }
      } catch (error) {
        toast.showError('Failed to schedule service reminders');
      } finally {
        setLoading(false);
      }
    };

    scheduleReminders();
  }, [user?.nextServiceDate]);

  return { loading };
};