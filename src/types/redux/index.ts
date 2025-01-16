// Core Redux Types
import type { UserProfile, UserAddress } from '../user';
import type { BaseEntity } from '../index';
import type { AdminData } from '../admin';

// Re-export the User type to maintain compatibility
export type User = UserProfile;

// Auth State
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  verificationId: string | null;
  phone: string | null;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  serviceType: 'repair' | 'maintenance' | 'installation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledDate: string;
  address: string;
  notes?: string;
  technicianId?: string;
  price?: number;
}

export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    date?: string;
  };
}

// Admin State
export interface AdminState {
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;
}

// Service State
export interface ServiceState {
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  }>;
  loading: boolean;
  error: string | null;
}

// User State
export interface UserState {
  currentUser: UserProfile | null;
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  verificationId: string | null;
  phone: string | null;
}

// Root State Type
export interface RootState {
  admin: AdminState;
  auth: AuthState;
  booking: BookingState;
  service: ServiceState;
  user: UserState;
}

// Store Types
export type AppDispatch = any; // Will be properly typed when store is created
