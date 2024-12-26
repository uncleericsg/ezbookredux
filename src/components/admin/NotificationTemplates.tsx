import { Bell } from 'lucide-react';
import React from 'react';

const NotificationTemplates: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold">Notification Management</h2>
      </div>

      {/* Templates Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Templates</h3>
        <div className="grid gap-4">
          {/* Template Items */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium">Booking Confirmation</h4>
            <p className="text-sm text-gray-400 mt-1">Sent when a booking is confirmed</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium">Appointment Reminder</h4>
            <p className="text-sm text-gray-400 mt-1">Sent 24 hours before appointment</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium">Service Completed</h4>
            <p className="text-sm text-gray-400 mt-1">Sent after service completion</p>
          </div>
        </div>
      </div>

      {/* Scheduled Messages */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Scheduled Messages</h3>
        <div className="grid gap-4">
          {/* Message Items */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium">Holiday Greetings</h4>
            <p className="text-sm text-gray-400 mt-1">Scheduled for Dec 25, 2024</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-medium">Maintenance Reminder</h4>
            <p className="text-sm text-gray-400 mt-1">Scheduled for next week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplates;