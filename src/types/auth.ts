import type { UserProfile } from './user';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refresh_token: string;
}

export interface VerificationRequest {
  type: 'email' | 'phone';
  value: string;
}

export interface VerificationResponse {
  verification_id: string;
  expires_at: string;
}

export interface VerificationConfirmation {
  verification_id: string;
  code: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  token: string;
  new_password: string;
}

export interface SessionInfo {
  user: UserProfile;
  token: string;
  expires_at: string;
  refresh_token: string;
}

export interface TokenRefreshResponse {
  token: string;
  expires_at: string;
}
