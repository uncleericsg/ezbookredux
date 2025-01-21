import type { 
  Notification, 
  NotificationResponse, 
  MarkAsReadResponse 
} from '../types/notification';

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'appointment_confirmation',
    title: 'Upcoming Appointment',
    message: 'Your aircon service appointment is scheduled for tomorrow at 2:00 PM',
    createdAt: new Date().toISOString(),
    read: false,
    priority: 'high',
    actionUrl: '/appointments'
  },
  {
    id: '2',
    userId: '1',
    type: 'amc_expiry',
    title: 'AMC Package Expiring Soon',
    message: 'Your AMC package will expire in 30 days. Renew now to continue enjoying premium benefits.',
    createdAt: new Date().toISOString(),
    read: false,
    priority: 'high',
    actionUrl: '/amc/packages'
  },
  {
    id: '3',
    userId: '1',
    type: 'service_reminder',
    title: 'Service Due',
    message: 'It\'s time for your regular aircon maintenance. Book a service now.',
    createdAt: new Date().toISOString(),
    read: false,
    priority: 'normal',
    actionUrl: '/'
  }
];

/**
 * Fetch notifications for a user
 */
export const fetchNotifications = async (userId: string): Promise<NotificationResponse> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: MOCK_NOTIFICATIONS.filter(n => n.userId === userId)
      });
    }, 1000);
  });
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<MarkAsReadResponse> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true
      });
    }, 500);
  });
};
