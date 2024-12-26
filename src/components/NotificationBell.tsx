import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@hooks/useNotifications';
import { useUser } from '@contexts/UserContext';

interface NotificationBellProps {
  showCount?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ showCount = true }) => {
  const { user } = useUser();
  const { unreadCount, notifications } = useNotifications(user?.id ?? '');
  const navigate = useNavigate();

  const hasUrgentNotifications = notifications.some(
    n => !n.read && n.priority === 'high'
  );

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
    >
      <Bell className="h-6 w-6" />
      
      <AnimatePresence>
        {showCount && unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs font-medium ${
              hasUrgentNotifications ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </AnimatePresence>

      {hasUrgentNotifications && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            repeatType: "reverse" 
          }}
          className="absolute -bottom-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
        />
      )}
    </button>
  );
};

export default NotificationBell;