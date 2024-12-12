import { useState, useEffect, useCallback } from 'react';
import { useMemo } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchNotifications, markNotificationAsRead } from '../services/notifications';
import type { Notification } from '../services/notifications';
import { useUser } from '../contexts';
import { useQueryClient } from '@tanstack/react-query';

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
  const { user } = useUser();
  const queryClient = useQueryClient();

  // For now, always return mock notifications
  const { data: notifications = MOCK_NOTIFICATIONS, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      // Return mock notifications instead of fetching from server
      return MOCK_NOTIFICATIONS;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      // Mock marking as read by updating local state
      queryClient.setQueryData(['notifications', user?.id], (old: any) => {
        if (!old) return old;
        return old.map((n: any) => n.id === id ? { ...n, read: true } : n);
      });
    },
    onSuccess: () => {
      // Don't show toast when marking as read since we're navigating away
      // toast.success('Notification marked as read');
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      // Mock marking all as read by updating local state
      queryClient.setQueryData(['notifications', user?.id], (old: any) => {
        if (!old) return old;
        return old.map((n: any) => ({ ...n, read: true }));
      });
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all notifications as read');
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      // Mock deleting all by updating local state
      queryClient.setQueryData(['notifications', user?.id], []);
    },
    onSuccess: () => {
      toast.success('All notifications deleted');
    },
    onError: () => {
      toast.error('Failed to delete notifications');
    },
  });

  // Compute unread count from notifications
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    deleteAll: deleteAllMutation.mutate,
    unreadCount,
  };
};