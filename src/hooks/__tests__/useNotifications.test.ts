import { renderHook, act } from '@testing-library/react';
import { useNotifications, isNotificationType } from '../useNotifications';
import type {
  NotificationTemplate,
  BookingNotificationData,
  PaymentNotificationData,
  ServiceNotificationData,
  NotificationStatus
} from '@/types/notification';
import { createNotificationVariable } from '@/types/notification';
import type { ServiceCategory } from '@/types/homepage';

describe('useNotifications', () => {
  // Mock data
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    amcStatus: 'active' as const
  };

  const mockService = {
    id: 'service-1',
    name: 'AC Service',
    description: 'Regular AC maintenance',
    type: 'maintenance' as const,
    price: 100,
    visible: true,
    order: 1
  };

  const mockBookingTemplate: NotificationTemplate<BookingNotificationData> = {
    id: 'booking-template-1',
    type: 'booking',
    title: 'Booking Confirmation',
    content: 'Your booking for {{service.name}} on {{date}} at {{time}} has been confirmed.',
    variables: [
      createNotificationVariable<BookingNotificationData, 'service'>({
        key: 'service',
        transform: (service) => service.name
      }),
      createNotificationVariable<BookingNotificationData, 'date'>({
        key: 'date'
      }),
      createNotificationVariable<BookingNotificationData, 'time'>({
        key: 'time'
      })
    ]
  };

  const mockBookingData: BookingNotificationData = {
    user: mockUser,
    service: mockService,
    date: '2025-01-21',
    time: '14:00',
    status: 'confirmed'
  };

  const mockPaymentTemplate: NotificationTemplate<PaymentNotificationData> = {
    id: 'payment-template-1',
    type: 'payment',
    title: 'Payment Received',
    content: 'Payment of {{amount}} {{currency}} has been received.',
    variables: [
      createNotificationVariable<PaymentNotificationData, 'amount'>({
        key: 'amount',
        transform: (amount) => amount.toFixed(2)
      }),
      createNotificationVariable<PaymentNotificationData, 'currency'>({
        key: 'currency'
      })
    ]
  };

  const mockPaymentData: PaymentNotificationData = {
    user: mockUser,
    amount: 100,
    currency: 'SGD',
    status: 'completed',
    date: '2025-01-21',
    paymentMethod: 'card'
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-21T14:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create and add a booking notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      const notification = result.current.createBookingNotification(
        mockBookingTemplate,
        mockBookingData
      );
      result.current.addNotification(notification);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      id: expect.any(String),
      templateId: mockBookingTemplate.id,
      type: 'booking',
      status: 'queued',
      data: mockBookingData,
      createdAt: expect.any(String)
    });
  });

  it('should create and add a payment notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      const notification = result.current.createPaymentNotification(
        mockPaymentTemplate,
        mockPaymentData
      );
      result.current.addNotification(notification);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      id: expect.any(String),
      templateId: mockPaymentTemplate.id,
      type: 'payment',
      status: 'queued',
      data: mockPaymentData,
      createdAt: expect.any(String)
    });
  });

  it('should remove a notification', () => {
    const { result } = renderHook(() => useNotifications());

    let notificationId: string;

    act(() => {
      const notification = result.current.createBookingNotification(
        mockBookingTemplate,
        mockBookingData
      );
      notificationId = notification.id;
      result.current.addNotification(notification);
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should update notification status', () => {
    const { result } = renderHook(() => useNotifications());

    let notificationId: string;
    const newStatus: NotificationStatus = 'sent';

    act(() => {
      const notification = result.current.createBookingNotification(
        mockBookingTemplate,
        mockBookingData
      );
      notificationId = notification.id;
      result.current.addNotification(notification);
    });

    act(() => {
      result.current.updateStatus(notificationId, newStatus);
    });

    expect(result.current.notifications[0].status).toBe(newStatus);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      const bookingNotification = result.current.createBookingNotification(
        mockBookingTemplate,
        mockBookingData
      );
      const paymentNotification = result.current.createPaymentNotification(
        mockPaymentTemplate,
        mockPaymentData
      );
      result.current.addNotification(bookingNotification);
      result.current.addNotification(paymentNotification);
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('should handle error state', () => {
    const { result } = renderHook(() => useNotifications());
    const errorMessage = 'Test error';

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should correctly identify notification types', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      const bookingNotification = result.current.createBookingNotification(
        mockBookingTemplate,
        mockBookingData
      );
      const paymentNotification = result.current.createPaymentNotification(
        mockPaymentTemplate,
        mockPaymentData
      );
      result.current.addNotification(bookingNotification);
      result.current.addNotification(paymentNotification);
    });

    const [bookingNotification, paymentNotification] = result.current.notifications;

    expect(isNotificationType(bookingNotification, 'booking')).toBe(true);
    expect(isNotificationType(bookingNotification, 'payment')).toBe(false);
    expect(isNotificationType(paymentNotification, 'payment')).toBe(true);
    expect(isNotificationType(paymentNotification, 'booking')).toBe(false);
  });
});