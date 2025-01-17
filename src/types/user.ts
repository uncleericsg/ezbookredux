import type { PaymentStatus } from './payment';

export type UserRole = 'user' | 'admin' | 'technician';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserAddress {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: UserRole;
  status: UserStatus;
  addresses?: UserAddress[];
  preferences?: UserPreferences;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends Omit<User, 'metadata'> {
  avatar?: string;
  bio?: string;
  paymentStatus?: PaymentStatus;
  verificationId?: string;
}
