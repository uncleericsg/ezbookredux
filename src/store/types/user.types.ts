import type { UserProfile } from '../../types/user';

export interface UserState {
  currentUser: UserProfile | null;
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  verificationId: string | null;
  phone: string | null;
} 