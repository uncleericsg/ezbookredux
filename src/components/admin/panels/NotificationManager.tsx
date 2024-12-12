import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const NotificationManager: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold">Notification Manager</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Notification Templates</h3>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              New Template
            </button>
          </div>
          <div className="border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400">Notification management interface will be implemented here.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationManager;
