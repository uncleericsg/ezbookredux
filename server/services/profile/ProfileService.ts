import { supabaseAdmin } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type {
  Profile,
  UpdateProfileRequest,
  ProfileService as IProfileService,
  ProfilePreferences
} from '@shared/types/profile';
import { StorageClient } from '@supabase/storage-js';

interface DatabaseProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  company_role?: string;
  preferences: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  company_role?: string;
  preferences?: string;
  updated_at?: string;
}

export class ProfileService implements IProfileService {
  async getProfile(userId: string): Promise<Profile> {
    try {
      logger.info('Fetching profile', { userId });

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Database error fetching profile', { error, userId });
        throw ApiError.database('Failed to fetch profile', error);
      }

      if (!profile) {
        logger.warn('Profile not found', { userId });
        throw ApiError.notFound('Profile', userId);
      }

      logger.info('Profile fetched successfully', { userId });
      return this.mapProfile(profile as DatabaseProfile);
    } catch (error) {
      logger.error('Get profile error', { error: String(error), userId });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to fetch profile');
    }
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<Profile> {
    try {
      logger.info('Updating profile', { userId, data });

      // Create database update request
      const updatedData: DatabaseUpdateRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        avatar_url: data.avatar_url,
        company_name: data.company_name,
        company_role: data.company_role,
        updated_at: new Date().toISOString()
      };

      // If preferences are provided, merge them with existing preferences
      if (data.preferences) {
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('preferences')
          .eq('id', userId)
          .single();

        if (existingProfile) {
          const existingPreferences = JSON.parse(existingProfile.preferences || '{}') as ProfilePreferences;
          updatedData.preferences = JSON.stringify({
            ...existingPreferences,
            ...data.preferences
          });
        } else {
          updatedData.preferences = JSON.stringify(data.preferences);
        }
      }

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .update(updatedData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Database error updating profile', { error, userId });
        throw ApiError.database('Failed to update profile', error);
      }

      if (!profile) {
        logger.warn('Profile not found', { userId });
        throw ApiError.notFound('Profile', userId);
      }

      logger.info('Profile updated successfully', { userId });
      return this.mapProfile(profile as DatabaseProfile);
    } catch (error) {
      logger.error('Update profile error', { error: String(error), userId });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to update profile');
    }
  }

  async updateAvatar(userId: string, file: File): Promise<string> {
    try {
      logger.info('Updating avatar', { userId, fileName: file.name });

      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}.${fileExt}`;

      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('public')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        logger.error('Storage error uploading avatar', { error: uploadError, userId });
        throw ApiError.server('Failed to upload avatar', uploadError);
      }

      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('public')
        .getPublicUrl(filePath);

      await this.updateProfile(userId, { avatar_url: publicUrl });

      logger.info('Avatar updated successfully', { userId, publicUrl });
      return publicUrl;
    } catch (error) {
      logger.error('Update avatar error', { error: String(error), userId });
      if (error instanceof ApiError) throw error;
      if (error instanceof StorageClient) {
        throw ApiError.server('Failed to upload avatar', error);
      }
      throw ApiError.server('Failed to update avatar');
    }
  }

  private mapProfile(profile: DatabaseProfile): Profile {
    return {
      id: profile.id,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      company_name: profile.company_name,
      company_role: profile.company_role,
      preferences: JSON.parse(profile.preferences || '{}') as ProfilePreferences,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    };
  }
}

export const profileService = new ProfileService();
