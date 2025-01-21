import { AuthError } from '../../shared/types/error';
import type { AppError, ErrorCode } from '../../shared/types/error';

export type AMCStatus = 'active' | 'inactive' | 'pending';

export type AuthErrorCode = Extract<ErrorCode, 
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_NETWORK_ERROR'
>;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  condoName?: string;
  lobbyTower?: string;
  amcStatus: AMCStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export interface StoredAuthData {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'CLEAR_AUTH' };

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Type guard for auth errors
export function isAuthError(error: unknown): error is AuthError {
  if (!(typeof error === 'object' && error !== null)) return false;
  
  const authError = error as Partial<AuthError>;
  return (
    'code' in authError &&
    typeof authError.code === 'string' &&
    [
      'AUTH_INVALID_CREDENTIALS',
      'AUTH_USER_NOT_FOUND',
      'AUTH_TOKEN_EXPIRED',
      'AUTH_INVALID_TOKEN',
      'AUTH_NETWORK_ERROR'
    ].includes(authError.code as AuthErrorCode)
  );
}

// Type guard for stored auth data
export function isStoredAuthData(data: unknown): data is StoredAuthData {
  if (!(typeof data === 'object' && data !== null)) return false;
  
  const authData = data as Partial<StoredAuthData>;
  return (
    'user' in authData &&
    'token' in authData &&
    'refreshToken' in authData &&
    'expiresAt' in authData &&
    typeof authData.token === 'string' &&
    typeof authData.refreshToken === 'string' &&
    typeof authData.expiresAt === 'number'
  );
}

// Helper function to create auth errors
export function createAuthError(
  code: AuthErrorCode,
  message: string,
  details?: Record<string, unknown>
): AuthError {
  return new AuthError(message, code, details);
}
