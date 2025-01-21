/**
 * Profile types
 */

/**
 * Profile preferences
 */
export interface ProfilePreferences {
  /**
   * Email notification preferences
   */
  emailNotifications?: {
    /**
     * Booking confirmations
     */
    bookingConfirmations?: boolean;

    /**
     * Booking reminders
     */
    bookingReminders?: boolean;

    /**
     * Marketing emails
     */
    marketing?: boolean;

    /**
     * Newsletter
     */
    newsletter?: boolean;
  };

  /**
   * Push notification preferences
   */
  pushNotifications?: {
    /**
     * Booking confirmations
     */
    bookingConfirmations?: boolean;

    /**
     * Booking reminders
     */
    bookingReminders?: boolean;

    /**
     * Chat messages
     */
    chatMessages?: boolean;

    /**
     * Promotions
     */
    promotions?: boolean;
  };

  /**
   * Theme preferences
   */
  theme?: {
    /**
     * Dark mode
     */
    darkMode?: boolean;

    /**
     * Color scheme
     */
    colorScheme?: 'system' | 'light' | 'dark';

    /**
     * Reduced motion
     */
    reducedMotion?: boolean;
  };

  /**
   * Language preferences
   */
  language?: {
    /**
     * Preferred language
     */
    preferred?: string;

    /**
     * Date format
     */
    dateFormat?: string;

    /**
     * Time format
     */
    timeFormat?: '12h' | '24h';
  };
}

/**
 * Profile entity
 */
export interface Profile {
  /**
   * Profile ID
   */
  id: string;

  /**
   * Email address
   */
  email: string;

  /**
   * First name
   */
  first_name?: string;

  /**
   * Last name
   */
  last_name?: string;

  /**
   * Phone number
   */
  phone?: string;

  /**
   * Avatar URL
   */
  avatar_url?: string;

  /**
   * Company name
   */
  company_name?: string;

  /**
   * Company role
   */
  company_role?: string;

  /**
   * Profile preferences
   */
  preferences: ProfilePreferences;

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Updated at timestamp
   */
  updated_at: string;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  /**
   * First name
   */
  first_name?: string;

  /**
   * Last name
   */
  last_name?: string;

  /**
   * Phone number
   */
  phone?: string;

  /**
   * Avatar URL
   */
  avatar_url?: string;

  /**
   * Company name
   */
  company_name?: string;

  /**
   * Company role
   */
  company_role?: string;

  /**
   * Profile preferences
   */
  preferences?: Partial<ProfilePreferences>;
}

/**
 * Profile service interface
 */
export interface ProfileService {
  /**
   * Get profile by user ID
   */
  getProfile(userId: string): Promise<Profile>;

  /**
   * Update profile
   */
  updateProfile(userId: string, data: UpdateProfileRequest): Promise<Profile>;

  /**
   * Update avatar
   */
  updateAvatar(userId: string, file: File): Promise<string>;
}
