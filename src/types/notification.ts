import type { User } from './auth';
import type { ServiceCategory } from './homepage';
import type { ExactOptionalPropertyTypes } from './exactOptional';

export type NotificationType = 
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'booking'
  | 'payment'
  | 'service';

export type NotificationPosition = 
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export type NotificationStatus = 'queued' | 'sending' | 'sent' | 'failed';

export type NotificationVariable<T extends Record<string, unknown>, K extends keyof T> = {
  key: K;
  transform?: (value: NonNullable<T[K]>) => string;
  fallback?: string;
  required?: boolean;
};

export interface NotificationTemplate<T extends Record<string, unknown>> {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  variables: Array<NotificationVariable<T, keyof T>>;
  position?: NotificationPosition;
  duration?: number;
  dismissible?: boolean;
}

export interface BaseNotificationData extends Record<string, unknown> {
  [key: string]: unknown;
}

export interface BookingNotificationData extends BaseNotificationData {
  user: User;
  service: ServiceCategory;
  date: string;
  time: string;
  status: string;
  price?: number;
  notes?: string;
}

export interface PaymentNotificationData extends BaseNotificationData {
  user: User;
  amount: number;
  currency: string;
  status: string;
  date: string;
  paymentMethod: string;
  invoiceNumber?: string;
}

export interface ServiceNotificationData extends BaseNotificationData {
  user: User;
  service: ServiceCategory;
  status: string;
  technician?: string;
  notes?: string;
  nextServiceDate?: string;
}

export type NotificationDataType = 
  | BookingNotificationData 
  | PaymentNotificationData 
  | ServiceNotificationData;

export interface NotificationData {
  id: string;
  templateId: string;
  type: NotificationType;
  status: NotificationStatus;
  data: NotificationDataType;
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface NotificationState {
  templates: Array<NotificationTemplate<any>>;
  notifications: NotificationData[];
  loading: boolean;
  error: string | null;
}

export type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: NotificationData }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: NotificationStatus } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ALL' };

// Base notification props with optional callback
export interface BaseNotificationProps<T extends Record<string, unknown>> {
  template: NotificationTemplate<T>;
  data: T;
  onClose?: () => void;
}

// Type-safe notification props with exact optional properties
export type NotificationTemplateProps<T extends Record<string, unknown>> = 
  ExactOptionalPropertyTypes<BaseNotificationProps<T>>;

// Type guard for notification data types
export function isBookingNotification(
  data: unknown
): data is BookingNotificationData {
  const booking = data as Partial<BookingNotificationData>;
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in booking &&
    'service' in booking &&
    'date' in booking &&
    'time' in booking &&
    'status' in booking
  );
}

export function isPaymentNotification(
  data: unknown
): data is PaymentNotificationData {
  const payment = data as Partial<PaymentNotificationData>;
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in payment &&
    'amount' in payment &&
    'currency' in payment &&
    'status' in payment &&
    'date' in payment &&
    'paymentMethod' in payment
  );
}

export function isServiceNotification(
  data: unknown
): data is ServiceNotificationData {
  const service = data as Partial<ServiceNotificationData>;
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in service &&
    'service' in service &&
    'status' in service
  );
}

// Helper function to interpolate template variables
export function interpolateTemplate<T extends Record<string, unknown>>(
  template: NotificationTemplate<T>,
  data: T
): string {
  let content = template.content;
  
  template.variables.forEach(variable => {
    const value = data[variable.key];
    const replacement = value !== undefined && value !== null
      ? variable.transform
        ? variable.transform(value as NonNullable<T[keyof T]>)
        : String(value)
      : variable.fallback || '';
      
    content = content.replace(
      new RegExp(`{{\\s*${String(variable.key)}\\s*}}`, 'g'),
      replacement
    );
  });
  
  return content;
}
