import type { User } from './user';

/**
 * User roles
 */
export type UserRole = 'admin' | 'user' | 'technician' | 'guest';

/**
 * Authentication error codes
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'USER_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVALID_ROLE'
  | 'INVALID_PERMISSIONS'
  | 'SESSION_EXPIRED'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'MAX_OTP_ATTEMPTS';

/**
 * Authentication error
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  token: string | null;
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  /**
   * JWT secret key
   */
  jwtSecret: string;

  /**
   * JWT expiration time
   */
  jwtExpiration: string;

  /**
   * Refresh token expiration time
   */
  refreshTokenExpiration: string;

  /**
   * OTP expiration time
   */
  otpExpiration: string;

  /**
   * Maximum OTP attempts
   */
  maxOtpAttempts: number;

  /**
   * Password hash rounds
   */
  passwordHashRounds: number;
}

/**
 * Authentication provider
 */
export type AuthProvider = 'email' | 'phone' | 'google' | 'facebook';

/**
 * Authentication method
 */
export type AuthMethod = 'password' | 'otp' | 'oauth';

/**
 * Authentication session
 */
export interface AuthSession {
  /**
   * Session ID
   */
  id: string;

  /**
   * User ID
   */
  userId: string;

  /**
   * Access token
   */
  token: string;

  /**
   * Refresh token
   */
  refreshToken: string;

  /**
   * Provider
   */
  provider: AuthProvider;

  /**
   * Method
   */
  method: AuthMethod;

  /**
   * Expiration time
   */
  expiresAt: string;

  /**
   * Created at
   */
  createdAt: string;

  /**
   * Last activity
   */
  lastActivity: string;

  /**
   * User agent
   */
  userAgent?: string;

  /**
   * IP address
   */
  ipAddress?: string;
}

export type { User };
