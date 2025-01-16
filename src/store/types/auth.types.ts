import type { UserProfile } from '../../types/user';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  verificationId: string | null;
  phone: string | null;
} 