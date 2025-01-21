import { useReducer, useCallback } from 'react';
import type {
  NotificationState,
  NotificationAction,
  NotificationData,
  NotificationTemplate,
  NotificationStatus,
  BookingNotificationData,
  PaymentNotificationData,
  ServiceNotificationData
} from '@/types/notification';

type NotificationDataType = 
  | BookingNotificationData 
  | PaymentNotificationData 
  | ServiceNotificationData;

const initialState: NotificationState = {
  templates: [],
  notifications: [],
  loading: false,
  error: null
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };

    case 'UPDATE_STATUS':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, status: action.payload.status }
            : notification
        )
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
        error: null
      };

    default:
      return state;
  }
}

export function useNotifications() {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = useCallback((notification: NotificationData) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const updateStatus = useCallback((id: string, status: NotificationStatus) => {
    dispatch({
      type: 'UPDATE_STATUS',
      payload: { id, status }
    });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  // Helper function to create a notification with proper typing
  const createNotification = useCallback(<T extends NotificationDataType>(
    template: NotificationTemplate<T>,
    data: T,
    status: NotificationStatus = 'queued'
  ): NotificationData => {
    return {
      id: `notification-${Date.now()}`,
      templateId: template.id,
      type: template.type,
      status,
      data,
      createdAt: new Date().toISOString()
    };
  }, []);

  // Type-safe notification creators
  const createBookingNotification = useCallback((
    template: NotificationTemplate<BookingNotificationData>,
    data: BookingNotificationData
  ) => {
    return createNotification<BookingNotificationData>(template, data);
  }, [createNotification]);

  const createPaymentNotification = useCallback((
    template: NotificationTemplate<PaymentNotificationData>,
    data: PaymentNotificationData
  ) => {
    return createNotification<PaymentNotificationData>(template, data);
  }, [createNotification]);

  const createServiceNotification = useCallback((
    template: NotificationTemplate<ServiceNotificationData>,
    data: ServiceNotificationData
  ) => {
    return createNotification<ServiceNotificationData>(template, data);
  }, [createNotification]);

  return {
    ...state,
    addNotification,
    removeNotification,
    updateStatus,
    clearAll,
    setError,
    setLoading,
    createNotification,
    createBookingNotification,
    createPaymentNotification,
    createServiceNotification
  };
}

// Type guard to check if a notification is of a specific type
export function isNotificationType<T extends NotificationDataType>(
  notification: NotificationData,
  type: NotificationTemplate<T>['type']
): notification is NotificationData & { data: T } {
  return notification.type === type;
}
