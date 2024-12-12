import React from 'react';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick, className = '' }) => {
  if (count === 0) return null;

  return (
    <span 
      className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full cursor-pointer ${className}`}
      onClick={onClick}
      role="status"
      aria-label={`${count} unread notifications`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default NotificationBadge;