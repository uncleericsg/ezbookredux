'use client';

import {
  Bell,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare
} from 'lucide-react';
import React from 'react';

export interface NotificationIconProps;


;

NotificationIcon.displayName = 'NotificationIcon';
const NotificationIcon: React.FC<NotificationIconProps> = ({
  type = 'default',
  size = 24,
  className = ''
}) => {
  const iconProps = {
    size,
    className: `${className} ${getIconColorClass(type)}`
  };

  return (
    <div className="flex items-center justify-center">
      {getIcon(type, iconProps)}
    </div>
  );
};

const getIcon = (
  type: NotificationIconProps['type'],
  props: { size: number; className: string }
) => {
  switch (type) {
    case 'success':
      return <CheckCircle {...props} />;
    case 'error':
      return <AlertCircle {...props} />;
    case 'info':
      return <Info {...props} />;
    case 'calendar':
      return <Calendar {...props} />;
    case 'message':
      return <MessageSquare {...props} />;
    default:
      return <Bell {...props} />;
  }
};

const getIconColorClass = (type: NotificationIconProps['type']): string => {
  switch (type) {
    case 'success':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    case 'info':
      return 'text-blue-500';
    case 'calendar':
      return 'text-purple-500';
    case 'message':
      return 'text-indigo-500';
    default:
      return 'text-gray-500';
  }
};

export { NotificationIcon };
undefined.displayName = 'undefined';