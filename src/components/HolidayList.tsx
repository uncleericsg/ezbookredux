import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Bell, AlertCircle } from 'lucide-react';
import { useHolidayNotifications } from '@hooks/useHolidayNotifications';

const HolidayList: React.FC = () => {
  const { upcomingHolidays, loading, error } = useHolidayNotifications();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 flex items-center space-x-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (upcomingHolidays.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No upcoming holidays in the next 30 days
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingHolidays.map((holiday) => (
        <div
          key={holiday.id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-blue-400 mt-1" />
              <div>
                <h3 className="font-medium">{holiday.holiday}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                  <span>{format(parseISO(holiday.date), 'MMMM d, yyyy')}</span>
                  <span>•</span>
                  <span>{holiday.dayOfWeek}</span>
                </div>
              </div>
            </div>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HolidayList;