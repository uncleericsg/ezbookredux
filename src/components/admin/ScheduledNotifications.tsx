import React, { memo } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { Bell } from 'lucide-react';
import type { HolidayGreeting } from '../../types';

interface ScheduledNotificationsProps {
  notifications: HolidayGreeting[];
}

const ScheduledNotifications = memo(({ notifications }: ScheduledNotificationsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notifications.map(notification => {
        const date = parseISO(notification.date);
        if (!isValid(date)) return null;

        return (
          <div 
            key={notification.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-start space-x-3">
              <Bell className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">{notification.holiday}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {format(date, 'MMMM d, yyyy')}
                </p>
                {notification.message && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {notification.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {notifications.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-400">
          No upcoming notifications scheduled
        </div>
      )}
    </div>
  );
});

ScheduledNotifications.displayName = 'ScheduledNotifications';

export default ScheduledNotifications;