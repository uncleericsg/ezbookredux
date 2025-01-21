/**
 * User types
 */

/**
 * User role
 */
export type UserRole = 'admin' | 'customer' | 'technician';

/**
 * User status
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * AMC status
 */
export type AMCStatus = 'active' | 'expired' | 'none';

/**
 * User interface
 */
export interface User {
  /**
   * User ID
   */
  id: string;

  /**
   * First name
   */
  firstName: string;

  /**
   * Last name
   */
  lastName: string;

  /**
   * Email address
   */
  email: string;

  /**
   * Phone number
   */
  phone?: string;

  /**
   * User role
   */
  role: UserRole;

  /**
   * Account status
   */
  status: UserStatus;

  /**
   * AMC subscription status
   */
  amcStatus: AMCStatus;

  /**
   * Account creation date
   */
  createdAt: string;

  /**
   * Last login date
   */
  lastLoginAt: string;

  /**
   * Profile image URL
   */
  avatarUrl?: string;

  /**
   * Email verification status
   */
  emailVerified: boolean;

  /**
   * Phone verification status
   */
  phoneVerified: boolean;

  /**
   * User metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * User status toggle props
 */
export interface UserStatusToggleProps {
  /**
   * User ID
   */
  userId: string;

  /**
   * Active status
   */
  isActive: boolean;

  /**
   * Toggle callback
   */
  onToggle: (userId: string, newStatus: boolean) => Promise<void>;
}
