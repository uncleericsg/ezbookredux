// Core Redux Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'customer' | 'admin' | 'technician';
  phone?: string;
  address?: string[];
}

// Auth State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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

// Root State Type
export interface RootState {
  auth: AuthState;
  booking: BookingState;
}

// Store Types
export type AppDispatch = any; // Will be properly typed when store is created
