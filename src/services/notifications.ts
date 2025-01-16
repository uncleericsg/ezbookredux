import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';
import type { Database } from '@/types/database';
import type { Notification, NotificationPreferences } from '@/types/notifications';
import { handleUnknownError } from '@/utils/errorHandling';

const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleUnknownError(error);
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw handleUnknownError(error);
  }
}

export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data || { email: true, push: true, sms: false };
  } catch (error) {
    throw handleUnknownError(error);
  }
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({ user_id: userId, ...preferences });

    if (error) throw error;
  } catch (error) {
    throw handleUnknownError(error);
  }
}