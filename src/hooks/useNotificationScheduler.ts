import { useEffect } from 'react';
import { addDays } from 'date-fns';
import { scheduleServiceReminder } from '@services/notifications';
import { useUser } from '@contexts/UserContext';

export const useNotificationScheduler = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.nextServiceDate) return;

    const scheduleReminders = async () => {
      const nextService = new Date(user.nextServiceDate);
      
      // Schedule 75-day reminder
      const reminderDate = addDays(nextService, -75);
      if (reminderDate > new Date()) {
        await scheduleServiceReminder(user.id, reminderDate, 'service_reminder');
      }

      // Schedule AMC expiry reminder (30 days before)
      if (user.amcStatus === 'active') {
        const expiryDate = addDays(nextService, -30);
        if (expiryDate > new Date()) {
          await scheduleServiceReminder(user.id, expiryDate, 'amc_expiry');
        }
      }
    };

    scheduleReminders();
  }, [user?.id, user?.nextServiceDate, user?.amcStatus]);
};