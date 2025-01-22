import type { BookingData } from './booking-flow';
import type { CustomerInfo } from './customer';

/**
 * User role type
 */
export type UserRole = 'admin' | 'customer' | 'technician';

/**
 * User status type
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  amcStatus: 'active' | 'inactive';
  customerInfo?: CustomerInfo;
  bookings?: BookingData[];
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLoginAt?: Date | string;
  metadata?: Record<string, unknown>;
  // Profile fields
  address?: string;
  unitNumber?: string;
  condoName?: string;
  lobbyTower?: string;
  nextServiceDate?: string;
  contractExpiryDate?: string;
}

/**
 * User state type
 */
export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  verificationId?: string;
  phone?: string;
}

/**
 * OTP verification payload
 */
export interface OTPVerificationPayload {
  code: string;
  verificationId: string;
  phone: string;
}

/**
 * OTP verification response
 */
export interface OTPVerificationResponse {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * OTP request response
 */
export interface OTPRequestResponse {
  verificationId: string;
}

/**
 * User profile type
 * Extended user information for authenticated users
 */
export interface UserProfile extends User {
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
  lastActivity?: string;
  deviceTokens?: string[];
  isVerified: boolean;
}
