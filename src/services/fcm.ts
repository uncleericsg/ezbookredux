import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { z } from 'zod';
import { toast } from 'sonner';
import { app } from './firebase';

let messaging: any = null;

// Initialize messaging only if supported
const initializeMessaging = async () => {
  try {
    if (await isSupported()) {
      messaging = getMessaging(app);
      return true;
    }
    return false;
  } catch (error) {
    console.error('FCM initialization failed:', error);
    return false;
  }
};

// Validation schemas
const fcmTokenSchema = z.string().regex(/^[A-Za-z0-9-_]+$/);

const notificationPayloadSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(4096),
  data: z.record(z.string()).optional(),
  imageUrl: z.string().url().optional()
});

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;

interface SendOptions {
  priority?: 'high' | 'normal';
  timeToLive?: number;
  collapseKey?: string;
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_OPTIONS: Required<Omit<SendOptions, 'priority' | 'timeToLive' | 'collapseKey'>> = {
  retries: 3,
  retryDelay: 1000
};

class FCMService {
  private static instance: FCMService;
  private rateLimiter: {
    tokens: number;
    lastRefill: number;
    maxTokens: number;
    refillRate: number;
  };

  private constructor() {
    // Initialize rate limiter (500 notifications per minute)
    this.rateLimiter = {
      tokens: 500,
      lastRefill: Date.now(),
      maxTokens: 500,
      refillRate: 60000
    };
  }

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  private async validateToken(token: string): Promise<void> {
    try {
      await fcmTokenSchema.parseAsync(token);
    } catch (error) {
      console.error('Invalid FCM token:', error);
      throw new Error('Invalid FCM token format');
    }
  }

  private async validatePayload(payload: NotificationPayload): Promise<void> {
    try {
      await notificationPayloadSchema.parseAsync(payload);
    } catch (error) {
      console.error('Invalid notification payload:', error);
      throw new Error('Invalid notification payload');
    }
  }

  private async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    const timePassed = now - this.rateLimiter.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.rateLimiter.refillRate) * this.rateLimiter.maxTokens;

    if (tokensToAdd > 0) {
      this.rateLimiter.tokens = Math.min(
        this.rateLimiter.maxTokens,
        this.rateLimiter.tokens + tokensToAdd
      );
      this.rateLimiter.lastRefill = now;
    }

    if (this.rateLimiter.tokens <= 0) {
      toast.error('FCM rate limit exceeded');
      return false;
    }

    this.rateLimiter.tokens--;
    return true;
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    options: Required<Pick<SendOptions, 'retries' | 'retryDelay'>>
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= options.retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt === options.retries) break;
        await new Promise(resolve => setTimeout(resolve, options.retryDelay * attempt));
      }
    }
    
    throw lastError;
  }

  public async sendNotification(
    token: string,
    payload: NotificationPayload,
    options: SendOptions = {}
  ): Promise<string> {
    try {
      if (!messaging) {
        const supported = await initializeMessaging();
        if (!supported) {
          throw new Error('FCM not supported in this environment');
        }
      }

      await this.validateToken(token);
      await this.validatePayload(payload);

      if (!(await this.checkRateLimit())) {
        throw new Error('Rate limit exceeded');
      }

      const { retries, retryDelay, ...fcmOptions } = { ...DEFAULT_OPTIONS, ...options };
      
      const message = await this.retryOperation(async () => ({
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl
        },
        data: payload.data,
        android: {
          priority: fcmOptions.priority === 'high' ? 'high' : 'normal',
          ttl: fcmOptions.timeToLive ? fcmOptions.timeToLive * 1000 : undefined,
          collapseKey: fcmOptions.collapseKey
        },
        apns: {
          headers: {
            'apns-priority': fcmOptions.priority === 'high' ? '10' : '5',
            'apns-collapse-id': fcmOptions.collapseKey
          }
        }
      }), { retries, retryDelay });

      const response = await messaging.send(message);
      toast.success('Notification sent successfully');
      return response;
    } catch (error) {
      console.error('FCM send error:', error);
      toast.error('Failed to send notification');
      throw error;
    }
  }

  public async sendMulticast(
    tokens: string[],
    payload: NotificationPayload,
    options: SendOptions = {}
  ): Promise<{ successCount: number; failureCount: number; responses: any[] }> {
    try {
      await Promise.all(tokens.map(token => this.validateToken(token)));
      await this.validatePayload(payload);

      if (tokens.length > 500) {
        throw new Error('Maximum of 500 tokens per multicast');
      }

      if (!(await this.checkRateLimit())) {
        throw new Error('Rate limit exceeded');
      }

      const message = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
        android: {
          priority: options.priority === 'high' ? 'high' : 'normal',
          ttl: options.timeToLive ? options.timeToLive * 1000 : undefined,
          collapseKey: options.collapseKey,
        },
        apns: {
          headers: {
            'apns-priority': options.priority === 'high' ? '10' : '5',
            'apns-collapse-id': options.collapseKey,
          },
        },
      };

      const response = await getMessaging().sendMulticast(message);
      return response;
    } catch (error) {
      console.error('FCM multicast error:', error);
      throw error;
    }
  }

  public async scheduleNotification(
    token: string,
    payload: NotificationPayload,
    scheduledTime: Date,
    options: SendOptions = {}
  ): Promise<string> {
    if (scheduledTime.getTime() <= Date.now()) {
      throw new Error('Scheduled time must be in the future');
    }

    try {
      // Validate inputs before scheduling
      await this.validateToken(token);
      await this.validatePayload(payload);

      // Schedule notification
      const response = await axios.post('/api/notifications/schedule', {
        token,
        payload,
        scheduledTime: scheduledTime.toISOString(),
        options
      });

      toast.success('Notification scheduled successfully');
      return response.data.id;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      toast.error('Failed to schedule notification');
      throw error;
    }
  }
}

export const fcmService = FCMService.getInstance();