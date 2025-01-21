/**
 * Customer types
 */

/**
 * Customer registration configuration
 */
export interface CustomerRegistrationConfig {
  /**
   * Require email address
   */
  requireEmail: boolean;

  /**
   * Require phone number
   */
  requirePhone: boolean;

  /**
   * Require physical address
   */
  requireAddress: boolean;

  /**
   * Verify email address
   */
  verifyEmail: boolean;

  /**
   * Verify phone number
   */
  verifyPhone: boolean;
}

/**
 * Customer preferences configuration
 */
export interface CustomerPreferencesConfig {
  /**
   * Allow push notifications
   */
  allowNotifications: boolean;

  /**
   * Allow marketing communications
   */
  allowMarketing: boolean;

  /**
   * Allow SMS messages
   */
  allowSMS: boolean;

  /**
   * Allow WhatsApp messages
   */
  allowWhatsApp: boolean;
}

/**
 * Customer privacy configuration
 */
export interface CustomerPrivacyConfig {
  /**
   * Data retention period in days
   */
  dataRetentionDays: number;

  /**
   * Anonymize inactive users
   */
  anonymizeInactive: boolean;

  /**
   * Inactive period in days before anonymization
   */
  inactivePeriodDays: number;

  /**
   * Enable GDPR compliance features
   */
  gdprCompliance: boolean;
}

/**
 * Customer loyalty program configuration
 */
export interface CustomerLoyaltyConfig {
  /**
   * Enable loyalty program
   */
  enabled: boolean;

  /**
   * Points awarded per booking
   */
  pointsPerBooking: number;

  /**
   * Points awarded per dollar spent
   */
  pointsPerDollar: number;

  /**
   * Minimum points required for redemption
   */
  minimumPointsRedemption: number;
}

/**
 * Customer configuration
 */
export interface CustomerConfig {
  /**
   * Registration configuration
   */
  registration: CustomerRegistrationConfig;

  /**
   * Preferences configuration
   */
  preferences: CustomerPreferencesConfig;

  /**
   * Privacy configuration
   */
  privacy: CustomerPrivacyConfig;

  /**
   * Loyalty program configuration
   */
  loyalty: CustomerLoyaltyConfig;
}

/**
 * Default customer configuration
 */
export const defaultCustomerConfig: CustomerConfig = {
  registration: {
    requireEmail: true,
    requirePhone: true,
    requireAddress: false,
    verifyEmail: true,
    verifyPhone: false
  },
  preferences: {
    allowNotifications: true,
    allowMarketing: false,
    allowSMS: true,
    allowWhatsApp: false
  },
  privacy: {
    dataRetentionDays: 365,
    anonymizeInactive: true,
    inactivePeriodDays: 180,
    gdprCompliance: true
  },
  loyalty: {
    enabled: true,
    pointsPerBooking: 100,
    pointsPerDollar: 1,
    minimumPointsRedemption: 1000
  }
};

/**
 * Customer settings component props
 */
export interface CustomerSettingsProps {
  /**
   * Initial configuration
   */
  config?: CustomerConfig;

  /**
   * Save configuration callback
   */
  onSave: (config: CustomerConfig) => Promise<void>;

  /**
   * Loading state
   */
  loading?: boolean;
}
