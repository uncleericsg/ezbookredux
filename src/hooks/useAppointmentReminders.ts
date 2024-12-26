import { useEffect } from 'react';
import { addDays } from 'date-fns';
import { useUserRedux } from '@contexts/UserContext';
import { scheduleServiceReminder } from '@services/notifications';
import { useToast } from '@hooks/useToast';

export const useAppointmentReminders = (appointmentDate: string) => {
  const { user } = useUserRedux();
  const toast = useToast();

  useEffect(() => {
    if (!user?.id || !appointmentDate) return;

    const scheduleReminders = async () => {
      try {
        const date = new Date(appointmentDate);
        
        // Schedule 7-day reminder
        const reminderDate = addDays(date, -7);
        await scheduleServiceReminder(user.id, reminderDate, 'service_reminder', {
          appointmentDate: date.toISOString(),
          reminderType: 'upcoming_service',
        });

        // Schedule 24-hour reminder
        const urgentReminderDate = addDays(date, -1);
        await scheduleServiceReminder(user.id, urgentReminderDate, 'service_reminder', {
          appointmentDate: date.toISOString(),
          reminderType: 'urgent_reminder',
        });

      } catch (error) {
        console.error('Failed to schedule reminders:', error);
        toast.showError('Failed to set up appointment reminders');
      }
    };

    scheduleReminders();
  }, [appointmentDate, user?.id]);
};