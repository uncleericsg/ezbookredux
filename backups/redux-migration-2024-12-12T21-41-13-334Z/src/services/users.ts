import { z } from 'zod';
import axios from 'axios';
import { hashPassword } from './auth';
import type { User } from '../types';

const userSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['user', 'admin']),
  amcStatus: z.enum(['active', 'expired', 'pending', 'inactive']),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
});

export const validateUserData = (data: unknown): data is User => {
  try {
    userSchema.parse(data);
    return true;
  } catch (error) {
    console.error('User validation failed:', error);
    return false;
  }
};

export const getUserDetails = async (userId: string): Promise<User> => {
  if (import.meta.env.DEV) {
    // Return mock user data for development
    const mockUser = {
      id: userId,
      firstName: 'John',
      lastName: 'Doe AMC',
      email: 'john@example.com',
      amcStatus: 'active',
      lastServiceDate: '2024-02-15',
      nextServiceDate: '2024-05-15',
      phone: '+65 9123 4567',
      address: '123 Singapore Street',
    };
    
    if (!validateUserData(mockUser)) {
      throw new Error('Invalid mock user data');
    }
    
    return mockUser;
  }

  try {
    const response = await axios.get(`/api/users/${userId}`);
    const userData = response.data;
    
    if (!validateUserData(userData)) {
      throw new Error('Invalid user data received from server');
    }
    
    return userData;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    // Validate updates
    const validatedUpdates = userSchema.partial().parse(updates);
    
    const response = await axios.put(`/api/users/${userId}`, validatedUpdates, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    const updatedUser = response.data;
    if (!validateUserData(updatedUser)) {
      throw new Error('Invalid user data received from server');
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};