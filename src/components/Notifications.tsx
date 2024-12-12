import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationList from './NotificationList';
import { Loader2 } from 'lucide-react';

const Notifications: React.FC = () => {
  const { user } = useUser();
  const { notifications, loading, markAsRead, markAllAsRead, deleteAllNotifications } = useNotifications(user?.id ?? '');

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {notifications.length > 0 ? (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onDeleteAll={deleteAllNotifications}
        />
      ) : (
        <div className="text-center py-8 text-gray-400">
          No notifications to display
        </div>
      )}
    </div>
  );
};

export default Notifications;