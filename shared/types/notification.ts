/**
 * Notification types
 */

/**
 * Notification priority
 */
export type NotificationPriority = 'high' | 'normal';

/**
 * Notification payload
 */
export interface NotificationPayload {
  /**
   * Notification title
   */
  title: string;

  /**
   * Notification body
   */
  body: string;

  /**
   * Optional data payload
   */
  data?: Record<string, string>;

  /**
   * Optional image URL
   */
  imageUrl?: string;
}

/**
 * Send options
 */
export interface SendOptions {
  /**
   * Number of retry attempts
   */
  retries?: number;

  /**
   * Delay between retries in milliseconds
   */
  retryDelay?: number;

  /**
   * Notification priority
   */
  priority?: NotificationPriority;

  /**
   * Time to live in seconds
   */
  timeToLive?: number;

  /**
   * Collapse key for grouping notifications
   */
  collapseKey?: string;
}

/**
 * Platform-specific options
 */
export interface FCMPlatformOptions {
  /**
   * Android options
   */
  android: {
    /**
     * Message priority
     */
    priority: 'high' | 'normal';

    /**
     * Time to live in milliseconds
     */
    ttl?: number;

    /**
     * Collapse key
     */
    collapseKey?: string;
  };

  /**
   * iOS options
   */
  apns: {
    /**
     * Headers
     */
    headers: {
      /**
       * Priority
       */
      'apns-priority': string;

      /**
       * Collapse ID
       */
      'apns-collapse-id'?: string;
    };
  };
}

/**
 * Error response
 */
export interface FCMError {
  /**
   * Error code
   */
  code: string;

  /**
   * Error message
   */
  message: string;
}

/**
 * Send response
 */
export interface SendResponse {
  /**
   * Success flag
   */
  success: boolean;

  /**
   * Message ID
   */
  messageId?: string;

  /**
   * Error details
   */
  error?: FCMError;
}

/**
 * Multicast response
 */
export interface MulticastResponse {
  /**
   * Number of successful sends
   */
  successCount: number;

  /**
   * Number of failed sends
   */
  failureCount: number;

  /**
   * Individual responses
   */
  responses: SendResponse[];
}

/**
 * FCM service interface
 */
export interface FCMService {
  /**
   * Send notification to a single device
   */
  sendNotification(
    token: string,
    payload: NotificationPayload,
    options?: SendOptions
  ): Promise<string>;

  /**
   * Send notification to multiple devices
   */
  sendMulticast(
    tokens: string[],
    payload: NotificationPayload,
    options?: SendOptions
  ): Promise<MulticastResponse>;
}
