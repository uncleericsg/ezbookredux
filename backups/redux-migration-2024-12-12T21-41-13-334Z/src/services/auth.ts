import type { User } from '../types';

// @integration-point Mock data for development
// TODO: Replace with Firebase/Supabase data
const TEST_ACCOUNTS = {
  TEST_USER: {
    email: 'djxpire76@gmail.com',
    password: 'test123456',
    user: {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'djxpire76@gmail.com',
      role: 'regular',
      phone: '1234567890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookings: [],
      amcStatus: 'inactive',
      lastServiceDate: '2024-02-15',
      nextServiceDate: null,
    }
  },
  ADMIN: {
    email: 'admin@admin.com',
    password: 'admin123',
    user: {
      id: 'admin-1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@admin.com',
      role: 'admin',
      phone: '0987654321',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookings: [],
      amcStatus: 'inactive',
      lastServiceDate: null,
      nextServiceDate: null,
    }
  },
  TECHNICIAN: {
    email: 'tech@example.com',
    password: 'tech123',
    user: {
      id: 'tech-1',
      firstName: 'Tech',
      lastName: 'Support',
      email: 'tech@example.com',
      role: 'tech',
      phone: '876543210',
      teamId: 'team-1',
      specializations: ['maintenance', 'repair', 'installation'],
      availability: {
        status: 'available',
        lastUpdated: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

// @integration-point Authentication function
// TODO: This will be replaced with Firebase phone auth
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const account = Object.values(TEST_ACCOUNTS).find(acc => acc.email === email && acc.password === password);
  return account ? account.user : null;
};

// @integration-point Phone authentication
// TODO: Implement with Firebase
export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; verificationId?: string }> => {
  // Mock OTP sending
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, verificationId: 'mock-verification-id' };
};

// @integration-point OTP verification
// TODO: Implement with Firebase
export const verifyOTP = async (verificationId: string, code: string): Promise<{ success: boolean; user?: User }> => {
  // Mock OTP verification
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { 
    success: code === '123456',
    user: TEST_ACCOUNTS.TEST_USER.user
  };
};

// @integration-point User data operations
// TODO: Implement with Supabase
export const userOperations = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = Object.values(TEST_ACCOUNTS).find(acc => acc.user.id === userId)?.user;
    return user || null;
  },

  // Update user profile
  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...TEST_ACCOUNTS.TEST_USER.user,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },

  // Get user addresses
  getUserAddresses: async (userId: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 'addr-1',
        name: 'Home',
        floorUnit: '#12-34',
        blockStreet: '123 Main St',
        postalCode: '123456',
        isDefault: true
      }
    ];
  }
};

// @integration-point Session management
// TODO: Implement with Firebase/Supabase
export const sessionOperations = {
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    // This will be replaced with Firebase/Supabase auth state check
    return localStorage.getItem('user') !== null;
  },

  // Logout user
  logout: async (): Promise<void> => {
    // This will be replaced with Firebase/Supabase logout
    localStorage.removeItem('user');
  }
};