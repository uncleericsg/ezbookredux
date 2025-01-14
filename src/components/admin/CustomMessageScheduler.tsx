import { Calendar, Clock, Users, Send, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { useCustomMessages } from '../../hooks/useCustomMessages';

interface MessageSchedule {
  id?: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  userType: 'all' | 'amc' | 'regular';
}

const CustomMessageScheduler: React.FC = () => {
  const [schedule, setSchedule] = useState<MessageSchedule>({
    message: '',
    scheduledDate: '',
    scheduledTime: '',
    userType: 'all'
  });
  
  const { scheduleMessage, loading } = useCustomMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await scheduleMessage({
      ...schedule,
      scheduledDate: `${schedule.scheduledDate}T${schedule.scheduledTime}`
    });
    
    // Reset form
    setSchedule({
      message: '',
      scheduledDate: '',
      scheduledTime: '',
      userType: 'all'
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Message Content
          </label>
          <textarea
            value={schedule.message}
            onChange={(e) => setSchedule(prev => ({ ...prev, message: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
            placeholder="Enter your message..."
            required
          />
          <p className="mt-1 text-sm text-gray-400">
            Available variables: {'{first_name}'}, {'{last_service_date}'}, {'{next_service_date}'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>Schedule Date</span>
              </div>
            </label>
            <input
              type="date"
              value={schedule.scheduledDate}
              onChange={(e) => setSchedule(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>Schedule Time</span>
              </div>
            </label>
            <input
              type="time"
              value={schedule.scheduledTime}
              onChange={(e) => setSchedule(prev => ({ ...prev, scheduledTime: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span>Target Users</span>
            </div>
          </label>
          <select
            value={schedule.userType}
            onChange={(e) => setSchedule(prev => ({ ...prev, userType: e.target.value as MessageSchedule['userType'] }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="all">All Users</option>
            <option value="amc">AMC Customers Only</option>
            <option value="regular">Regular Customers Only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-icon bg-blue-600 hover:bg-blue-700 ml-auto"
          title="Schedule message"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomMessageScheduler;