import type { User } from '../types';

// @integration-point Mock data for development
// TODO: Replace with Firebase/Supabase data
const TEST_ACCOUNTS = {
  ADMIN: {
    phone: '91874498',
    otp: '123456',
    user: {
      id: 'admin-1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@admin.com',
      role: 'admin',
      phone: '91874498',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookings: [],
      amcStatus: 'inactive',
      lastServiceDate: null,
      nextServiceDate: null,
    }
  },
  TECHNICIAN: {
    phone: '91234567',
    otp: '123456',
    user: {
      id: 'tech-1',
      firstName: 'Tech',
      lastName: 'Support',
      email: 'tech@example.com',
      role: 'tech',
      phone: '91234567',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookings: [],
      amcStatus: 'inactive',
      lastServiceDate: null,
      nextServiceDate: null,
    }
  }
};

// @integration-point Phone authentication
// TODO: Implement with Firebase
export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; verificationId?: string }> => {
  // For development, always succeed with test accounts
  if (Object.values(TEST_ACCOUNTS).some(account => account.phone === phoneNumber)) {
    return { success: true, verificationId: 'test-verification-id' };
  }
  return { success: false };
};

// @integration-point OTP verification
// TODO: Implement with Firebase
export const verifyOTP = async (
  verificationId: string,
  code: string,
  phone: string
): Promise<{ success: boolean; user?: User }> => {
  // For development, check test accounts
  const account = Object.values(TEST_ACCOUNTS).find(acc => acc.phone === phone);
  if (account && account.otp === code) {
    // Ensure role is set
    const userWithRole = {
      ...account.user,
      role: account.user.role || 'user' // Default to 'user' if no role
    };
    return { success: true, user: userWithRole };
  }
  return { success: false };
};

// @integration-point User data operations
// TODO: Implement with Supabase
export const userOperations = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<User | null> => {
    const account = Object.values(TEST_ACCOUNTS).find(acc => acc.user.id === userId);
    if (account) {
      // Ensure role is set
      const userWithRole = {
        ...account.user,
        role: account.user.role || 'user' // Default to 'user' if no role
      };
      return userWithRole;
    }
    return null;
  },

  // Update user profile
  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User | null> => {
    const account = Object.values(TEST_ACCOUNTS).find(acc => acc.user.id === userId);
    if (account) {
      account.user = { 
        ...account.user, 
        ...data,
        role: data.role || account.user.role || 'user' // Preserve role or default to 'user'
      };
      return account.user;
    }
    return null;
  },

  // Get user addresses
  getUserAddresses: async (userId: string): Promise<any[]> => {
    return [];
  }
};

// @integration-point Session management
// TODO: Implement with Firebase/Supabase
export const sessionOperations = {
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    return false;
  },
};