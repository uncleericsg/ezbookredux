/**
 * Notification priority type
 */
export type NotificationPriority = 'high' | 'normal' | 'low';

/**
 * Notification type
 */
export type NotificationType = 
  | 'appointment_confirmation'
  | 'amc_expiry'
  | 'service_reminder'
  | 'payment_success'
  | 'payment_failed'
  | 'booking_cancelled'
  | 'booking_rescheduled'
  | 'system_maintenance';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  priority: NotificationPriority;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Notification service response
 */
export interface NotificationResponse {
  data?: Notification[];
  error?: string;
}

/**
 * Mark as read response
 */
export interface MarkAsReadResponse {
  success: boolean;
  error?: string;
}
