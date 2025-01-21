import type { BaseEntity } from './repository';
import type { Request, Response, NextFunction } from 'express';

/**
 * User roles
 */
export type UserRole = 'admin' | 'customer' | 'technician' | 'service_provider';

/**
 * User status
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

/**
 * Authentication strategy type
 */
export type AuthStrategyType = 'jwt' | 'api-key' | 'session';

/**
 * Authentication strategy configuration
 */
export interface AuthStrategyConfig {
  /**
   * Strategy type
   */
  strategy: string;

  /**
   * JWT configuration
   */
  jwt?: {
    /**
     * JWT secret
     */
    secret: string;

    /**
     * JWT expiration
     */
    expiration: string;

    /**
     * Refresh token expiration
     */
    refreshTokenExpiration: string;
  };

  /**
   * API key configuration
   */
  apiKey?: {
    /**
     * Header name
     */
    header: string;

    /**
     * Query parameter name
     */
    query?: string;
  };

  /**
   * Session configuration
   */
  session?: {
    /**
     * Cookie name
     */
    cookie: string;

    /**
     * Session expiration
     */
    expiration: string;
  };
}

/**
 * User entity
 */
export interface User extends BaseEntity {
  /**
   * Email address
   */
  email: string;

  /**
   * Full name
   */
  name: string;

  /**
   * Phone number
   */
  phone?: string;

  /**
   * User role
   */
  role: UserRole;

  /**
   * User status
   */
  status: UserStatus;

  /**
   * Email verified
   */
  emailVerified: boolean;

  /**
   * Phone verified
   */
  phoneVerified: boolean;

  /**
   * Password hash
   */
  passwordHash?: string;

  /**
   * Password salt
   */
  passwordSalt?: string;

  /**
   * Password reset token
   */
  passwordResetToken?: string;

  /**
   * Password reset token expiry
   */
  passwordResetTokenExpiry?: Date;

  /**
   * Email verification token
   */
  emailVerificationToken?: string;

  /**
   * Email verification token expiry
   */
  emailVerificationTokenExpiry?: Date;

  /**
   * Phone verification token
   */
  phoneVerificationToken?: string;

  /**
   * Phone verification token expiry
   */
  phoneVerificationTokenExpiry?: Date;

  /**
   * Last login date
   */
  lastLoginAt?: Date;

  /**
   * Last password change date
   */
  lastPasswordChangeAt?: Date;

  /**
   * Failed login attempts
   */
  failedLoginAttempts?: number;

  /**
   * Account lockout until date
   */
  lockedUntil?: Date;

  /**
   * Account suspension reason
   */
  suspensionReason?: string;

  /**
   * Account suspension date
   */
  suspendedAt?: Date;

  /**
   * Account deletion reason
   */
  deletionReason?: string;

  /**
   * Account deletion date
   */
  deletedAt?: Date;

  /**
   * User preferences
   */
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };

  /**
   * User metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Authentication provider
 */
export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple';

/**
 * Authentication method
 */
export type AuthMethod = 'password' | 'oauth' | 'magic_link' | 'phone';

/**
 * Session entity
 */
export interface Session extends BaseEntity {
  /**
   * User ID
   */
  userId: string;

  /**
   * Session token
   */
  token: string;

  /**
   * Authentication provider
   */
  provider: AuthProvider;

  /**
   * Authentication method
   */
  method: AuthMethod;

  /**
   * IP address
   */
  ipAddress: string;

  /**
   * User agent
   */
  userAgent: string;

  /**
   * Expires at
   */
  expiresAt: Date;

  /**
   * Last activity date
   */
  lastActivityAt: Date;

  /**
   * Revoked date
   */
  revokedAt?: Date;

  /**
   * Revocation reason
   */
  revocationReason?: string;

  /**
   * Session metadata
   */
  metadata?: Record<string, unknown>;

  /**
   * Related user
   */
  user?: User;
}

/**
 * Authentication token
 */
export interface AuthToken {
  /**
   * Access token
   */
  accessToken: string;

  /**
   * Refresh token
   */
  refreshToken: string;

  /**
   * Token type
   */
  tokenType: 'Bearer';

  /**
   * Expires in seconds
   */
  expiresIn: number;

  /**
   * Scope
   */
  scope?: string[];
}

/**
 * Authentication result
 */
export interface AuthResult {
  /**
   * User
   */
  user: User;

  /**
   * Session
   */
  session: Session;

  /**
   * Token
   */
  token: AuthToken;
}

/**
 * Authentication error
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Authentication middleware options
 */
export interface AuthMiddlewareOptions {
  /**
   * Required roles
   */
  roles?: UserRole[];

  /**
   * Optional authentication
   */
  optional?: boolean;

  /**
   * Authentication strategies to try
   */
  strategies?: string[];

  /**
   * Custom error handler
   */
  onError?: (error: AuthError, req: Request, res: Response) => Promise<void>;

  /**
   * Strategy configuration
   */
  config?: AuthStrategyConfig;

  /**
   * Excluded paths
   */
  excludePaths?: string[];

  /**
   * Role-based path restrictions
   */
  roleBasedPaths?: Record<string, UserRole[]>;
}

/**
 * Authentication handler
 */
export type AuthHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Authentication strategy
 */
export interface AuthStrategy {
  /**
   * Strategy name
   */
  name: string;

  /**
   * Authenticate request
   */
  authenticate(req: Request): Promise<User>;
}

/**
 * User profile
 */
export interface UserProfile {
  /**
   * User ID
   */
  id: string;

  /**
   * Email address
   */
  email: string;

  /**
   * User role
   */
  role: UserRole;

  /**
   * User permissions
   */
  permissions: string[];
}

/**
 * Authentication service
 */
export interface AuthService {
  /**
   * Create user
   */
  createUser(data: Partial<User>): Promise<User>;

  /**
   * Update user
   */
  updateUser(id: string, data: Partial<User>): Promise<User>;

  /**
   * Delete user
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Find user by ID
   */
  findUserById(id: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findUserByEmail(email: string): Promise<User | null>;

  /**
   * Find user by phone
   */
  findUserByPhone(phone: string): Promise<User | null>;

  /**
   * Create session
   */
  createSession(userId: string, data: Partial<Session>): Promise<Session>;

  /**
   * Update session
   */
  updateSession(id: string, data: Partial<Session>): Promise<Session>;

  /**
   * Delete session
   */
  deleteSession(id: string): Promise<void>;

  /**
   * Find session by ID
   */
  findSessionById(id: string): Promise<Session | null>;

  /**
   * Find session by token
   */
  findSessionByToken(token: string): Promise<Session | null>;

  /**
   * Create token
   */
  createToken(user: User, session: Session): Promise<AuthToken>;

  /**
   * Verify token
   */
  verifyToken(token: string): Promise<UserProfile>;

  /**
   * Verify API key
   */
  verifyApiKey(apiKey: string): Promise<UserProfile>;

  /**
   * Verify session
   */
  verifySession(sessionId: string): Promise<UserProfile>;

  /**
   * Refresh token
   */
  refreshToken(refreshToken: string): Promise<AuthToken>;

  /**
   * Revoke token
   */
  revokeToken(token: string): Promise<void>;
}
