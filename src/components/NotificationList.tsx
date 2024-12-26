import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import { LoadingScreen } from '@components/LoadingScreen';
import NotificationActions from '@components/NotificationActions';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '@types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
  isLoading: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onDeleteAll,
  isLoading,
}) => {
  const navigate = useNavigate();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment_confirmation':
        return Calendar;
      case 'service_reminder':
        return Bell;
      case 'amc_expiry':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const handleClick = async (notification: Notification) => {
    if (!notification.read) {
      await onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      <NotificationActions
        onMarkAllRead={onMarkAllRead}
        onDeleteAll={onDeleteAll}
        hasUnread={notifications.some(n => !n.read)}
        hasNotifications={notifications.length > 0}
      />
      
      <AnimatePresence>
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
          </motion.div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);

            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleClick(notification)}
                className={`
                  bg-gray-800 rounded-lg p-4 border cursor-pointer
                  transition-colors hover:bg-gray-700/50
                  ${notification.read ? 'border-gray-700' : 'border-blue-500'}
                  ${notification.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    notification.priority === 'high' 
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-gray-700 text-blue-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                        </span>
                        {notification.actionUrl && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;