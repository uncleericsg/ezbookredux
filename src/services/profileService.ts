import type { Profile, UpdateProfileRequest } from '../types/profile';
import { createApiError } from '../utils/error';
import type { ErrorCode } from '@shared/types/error';

const INTERNAL_ERROR: ErrorCode = 'INTERNAL_SERVER_ERROR';

export const fetchProfile = async (userId: string): Promise<Profile> => {
  try {
    // Fetch profile implementation
    throw new Error('Not implemented');
  } catch (error) {
    throw createApiError('Failed to fetch profile', INTERNAL_ERROR);
  }
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileRequest
): Promise<Profile> => {
  try {
    // Update profile implementation
    throw new Error('Not implemented');
  } catch (error) {
    throw createApiError('Failed to update profile', INTERNAL_ERROR);
  }
};

export const updateAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    // Update avatar implementation
    throw new Error('Not implemented');
  } catch (error) {
    throw createApiError('Failed to update avatar', INTERNAL_ERROR);
  }
}; 