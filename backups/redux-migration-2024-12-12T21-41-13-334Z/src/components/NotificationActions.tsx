import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationActionsProps {
  onMarkAllRead: () => Promise<void>;
  onDeleteAll: () => Promise<void>;
  hasUnread: boolean;
  hasNotifications: boolean;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllRead,
  onDeleteAll,
  hasUnread,
  hasNotifications
}) => {
  const handleMarkAllRead = async () => {
    try {
      await onMarkAllRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Are you sure you want to delete all notifications?');
    if (!confirmed) return;

    try {
      await onDeleteAll();
      toast.success('All notifications deleted');
    } catch (error) {
      toast.error('Failed to delete notifications');
    }
  };

  return (
    <div className="btn-group mb-4">
      <button
        onClick={handleMarkAllRead}
        disabled={!hasUnread}
        className="btn-icon bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        title="Mark all as read"
      >
        <CheckCircle className="h-4 w-4" />
      </button>
      
      <button
        onClick={handleDeleteAll}
        disabled={!hasNotifications}
        className="btn-icon bg-gray-700 hover:bg-gray-600 text-red-400 hover:text-red-300 disabled:opacity-50"
        title="Delete all notifications"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default NotificationActions;