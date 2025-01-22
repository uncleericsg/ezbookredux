import type { User } from '@/types/user';
import type { BookingDetails, BookingState, PaymentStatus } from '@/types/booking';
import type { ServiceProvider, ServiceVisit } from '@/types/service';

export interface AdminState {
  adminData: {
    settings: Record<string, any>;
    stats: Record<string, any>;
  };
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface BookingState {
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  paymentStatus: PaymentStatus | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}

export interface ServiceState {
  services: ServiceProvider[];
  isLoading: boolean;
  error: string | null;
  selectedService: string | null;
  currentService: ServiceVisit | null;
  filters: {
    category: string | null;
    status: string | null;
    date: string | null;
  };
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  paymentStatus: PaymentStatus | null;
  verificationId: string | null;
  phone: string | null;
}

export interface AppState {
  admin: AdminState;
  auth: AuthState;
  booking: BookingState;
  service: ServiceState;
  user: UserState;
}

export type RootState = AppState;
