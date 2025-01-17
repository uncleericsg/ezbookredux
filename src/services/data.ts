// @integration-point Data service for Supabase operations
// This file will contain all Supabase database operations

import type { User } from '@/types/user';

interface Address {
  id: string;
  name: string;
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Booking {
  id: string;
  userId: string;
  serviceType: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  date: string;
  time: string;
  address: Address;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data for development
const mockBookings: Booking[] = [
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
export const bookingOperations = {
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBookings.filter(booking => booking.userId === userId);
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  updateBooking: async (bookingId: string, data: Partial<Booking>): Promise<Booking> => {
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
export const addressOperations = {
  getUserAddresses: async (userId: string): Promise<Address[]> => {
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

  addAddress: async (addressData: Omit<Address, 'id' | 'createdAt'>): Promise<Address> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...addressData,
      id: `addr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  updateAddress: async (addressId: string, data: Partial<Address>): Promise<Address> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: addressId,
      ...data,
      updatedAt: new Date().toISOString()
    } as Address;
  }
};

// @integration-point Profile operations
export const profileOperations = {
  getProfile: async (userId: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: userId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: userId,
      ...data,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User;
  }
};
