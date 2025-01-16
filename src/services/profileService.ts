import { createClient } from '@supabase/supabase-js';
import { Profile, UpdateProfileRequest } from '../types/profile';
import { createApiError } from '../utils/apiResponse';
import { Database } from '../types/supabase';

export class ProfileService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  async getProfile(userId: string): Promise<Profile> {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!profile) throw createApiError('Profile not found', 'NOT_FOUND');

      return profile;
    } catch (error) {
      console.error('Get profile error:', error);
      throw createApiError('Failed to fetch profile', 'SERVER_ERROR');
    }
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<Profile> {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      if (!profile) throw createApiError('Profile not found', 'NOT_FOUND');

      return profile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw createApiError('Failed to update profile', 'SERVER_ERROR');
    }
  }

  async updateAvatar(userId: string, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await this.supabase
        .storage
        .from('public')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = this.supabase
        .storage
        .from('public')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Update avatar error:', error);
      throw createApiError('Failed to update avatar', 'SERVER_ERROR');
    }
  }
} 