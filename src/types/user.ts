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
  customerInfo?: CustomerInfo;
  bookings?: BookingData[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  metadata?: Record<string, unknown>;
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
 * Auth state type
 */
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
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
