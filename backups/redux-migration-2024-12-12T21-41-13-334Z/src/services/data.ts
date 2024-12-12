// @integration-point Data service for Supabase operations
// This file will contain all Supabase database operations

import type { User } from '../types';

// Mock data for development
const mockBookings = [
  {
    id: 'booking-1',
    userId: 'user-1',
    serviceType: 'maintenance',
    status: 'scheduled',
    date: '2024-03-01',
    time: '10:00',
    address: {
      id: 'addr-1',
      name: 'Home',
      floorUnit: '#12-34',
      blockStreet: '123 Main St',
      postalCode: '123456'
    }
  }
];

// @integration-point Booking operations
// TODO: Replace with Supabase queries
export const bookingOperations = {
  // Get user's bookings
  getUserBookings: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings.filter(booking => booking.userId === userId);
  },

  // Create new booking
  createBooking: async (bookingData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  // Update booking
  updateBooking: async (bookingId: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...mockBookings[0],
      ...data,
      id: bookingId,
      updatedAt: new Date().toISOString()
    };
  }
};

// @integration-point Address operations
// TODO: Replace with Supabase queries
export const addressOperations = {
  // Get user's addresses
  getUserAddresses: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{
      id: 'addr-1',
      name: 'Home',
      floorUnit: '#12-34',
      blockStreet: '123 Main St',
      postalCode: '123456',
      isDefault: true
    }];
  },

  // Add new address
  addAddress: async (userId: string, addressData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...addressData,
      id: `addr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  // Update address
  updateAddress: async (addressId: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: addressId,
      ...data,
      updatedAt: new Date().toISOString()
    };
  }
};

// @integration-point Profile operations
// TODO: Replace with Supabase queries
export const profileOperations = {
  // Get user profile
  getProfile: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: userId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890'
    };
  },

  // Update profile
  updateProfile: async (userId: string, data: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: userId,
      ...data,
      updatedAt: new Date().toISOString()
    };
  }
};
