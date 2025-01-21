import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchNotifications, markNotificationAsRead } from '../services/notifications';
import type { Notification } from '../types/notification';
import { useAppSelector } from '../store';

/**
 * Hook to manage user notifications
 */
export const useNotifications = () => {
  const user = useAppSelector(state => state.user.currentUser);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => fetchNotifications(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', user?.id]
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      toast.error(errorMessage);
    }
  });

  // Handle marking notification as read
  const handleMarkAsRead = useCallback((notificationId: string) => {
    if (!user?.id) return;
    void markAsReadMutation.mutate(notificationId);
  }, [user?.id, markAsReadMutation]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notificationsResponse?.data?.filter((notification: Notification) => !notification.read).length || 0;
  }, [notificationsResponse?.data]);

  // Sort notifications by priority, read status, and date
  const sortedNotifications = useMemo(() => {
    const notifications = notificationsResponse?.data || [];
    return [...notifications].sort((a: Notification, b: Notification) => {
      // First sort by priority
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      
      // Then sort by read status
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      
      // Finally sort by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notificationsResponse?.data]);

  return {
    notifications: sortedNotifications,
    unreadCount,
    isLoading,
    markAsRead: handleMarkAsRead,
    error: notificationsResponse?.error
  };
};
