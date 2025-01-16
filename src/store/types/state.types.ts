import type { User } from '@/types/user';
import type { ServiceCategory, ServiceOption } from '@/types/service';
import type { BookingDetails } from '@/types/booking';

export interface AdminState {
  isAdmin: boolean;
  adminData: {
    workingHours: {
      start: string;
      end: string;
    };
    bufferBetweenBookings: number;
    allowGuestBookings: boolean;
    showRevenueChart: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  verificationId: string | null;
  phone: string | null;
}

export interface ServiceState {
  services: ServiceCategory[];
  selectedService: ServiceOption | null;
  loading: boolean;
  error: string | null;
}

export interface BookingState {
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  filters: {
    status: string[];
    dateRange: [Date | null, Date | null];
  };
  loading: boolean;
  error: string | null;
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  admin: AdminState;
  auth: AuthState;
  booking: BookingState;
  service: ServiceState;
  user: UserState;
}

export type { User, ServiceCategory, ServiceOption, BookingDetails };
