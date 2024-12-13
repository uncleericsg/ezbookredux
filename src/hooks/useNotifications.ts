import { useState, useEffect, useCallback } from 'react';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchNotifications, markNotificationAsRead } from '../services/notifications';
import type { Notification } from '../services/notifications';
import { useAppSelector } from '../store';

// Mock notifications data with actionUrls
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
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
    type: 'service_reminder',
    title: 'Service Due',
    message: 'It\'s time for your regular aircon maintenance. Book a service now.',
    createdAt: new Date().toISOString(),
    read: false,
    priority: 'normal',
    actionUrl: '/'  // Routes to home page for service category selection
  }
];

export const useNotifications = () => {
  const { currentUser: user } = useAppSelector(state => state.user);
  const queryClient = useQueryClient();

  // For now, always return mock notifications
  const { data: notifications = MOCK_NOTIFICATIONS, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => fetchNotifications(user?.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const handleMarkAsRead = useCallback((notificationId: string) => {
    if (!user?.id) return;
    markAsReadMutation.mutate({ userId: user.id, notificationId });
  }, [user?.id, markAsReadMutation]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      // First sort by priority
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      
      // Then sort by read status
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      
      // Finally sort by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications]);

  return {
    notifications: sortedNotifications,
    unreadCount,
    isLoading,
    markAsRead: handleMarkAsRead,
  };
};