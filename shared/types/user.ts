import type { DatabaseError } from './error';

export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at?: string | null;
  last_sign_in_at?: string | null;
  role: UserRole;
  status: UserStatus;
  profile?: UserProfile | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
}

export type UserRole = 'admin' | 'user' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface AuthResponse {
  user: User | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null;
}

export interface AuthenticationError extends DatabaseError {
  name: string;
  status: number;
}

export interface OTPVerificationPayload {
  phone: string;
  code: string;
  verificationId: string;
}
