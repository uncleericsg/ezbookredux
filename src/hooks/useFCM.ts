import { useState, useCallback } from 'react';
import { fcmService, type NotificationPayload } from '@services/fcm';
import { toast } from 'sonner';

interface UseFCMOptions {
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export const useFCM = (options: UseFCMOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendNotification = useCallback(async (
    token: string,
    payload: NotificationPayload,
    priority: 'high' | 'normal' = 'normal'
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fcmService.sendNotification(token, payload, { priority });
      
      toast.success('Notification sent successfully');
      options.onSuccess?.(response);
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send notification');
      setError(error);
      toast.error(error.message);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const sendMulticast = useCallback(async (
    tokens: string[],
    payload: NotificationPayload,
    priority: 'high' | 'normal' = 'normal'
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fcmService.sendMulticast(tokens, payload, { priority });
      
      toast.success(`Sent to ${response.successCount} devices`);
      if (response.failureCount > 0) {
        toast.warning(`Failed to send to ${response.failureCount} devices`);
      }
      
      options.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send notifications');
      setError(error);
      toast.error(error.message);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const scheduleNotification = useCallback(async (
    token: string,
    payload: NotificationPayload,
    scheduledTime: Date,
    priority: 'high' | 'normal' = 'normal'
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fcmService.scheduleNotification(
        token,
        payload,
        scheduledTime,
        { priority }
      );
      
      toast.success('Notification scheduled successfully');
      options.onSuccess?.(response);
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to schedule notification');
      setError(error);
      toast.error(error.message);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    loading,
    error,
    sendNotification,
    sendMulticast,
    scheduleNotification
  };
};