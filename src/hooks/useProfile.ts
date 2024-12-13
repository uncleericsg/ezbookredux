import { useState, useCallback } from 'react';
import { useUserRedux } from './useUserRedux';
import { toast } from 'sonner';
import type { User } from '../types';

export const useProfile = () => {
  const { user, updateProfile: updateReduxProfile } = useUserRedux();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Update Redux store
      await updateReduxProfile(updates);
      
      toast.success('Profile updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateReduxProfile]);

  const uploadProfilePicture = useCallback(async (file: File) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // In a real app, this would upload to storage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile picture updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload profile picture';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateNotificationPreferences = useCallback(async (preferences: {
    email: boolean;
    sms: boolean;
    serviceReminders: boolean;
    promotionalUpdates: boolean;
  }) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Notification preferences updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    updateProfile,
    uploadProfilePicture,
    updateNotificationPreferences
  };
};