import React from 'react';
import { Check, Trash2 } from 'lucide-react';

interface NotificationActionsProps {
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
  notificationCount: number;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllRead,
  onDeleteAll,
  notificationCount,
}) => {
  if (notificationCount === 0) return null;

  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={onMarkAllRead}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Check className="h-4 w-4 mr-2" />
        Mark all read
      </button>
      <button
        onClick={onDeleteAll}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear all
      </button>
    </div>
  );
};

export default NotificationActions;