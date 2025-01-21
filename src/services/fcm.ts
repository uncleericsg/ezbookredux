import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';
import { z } from 'zod';
import { toast } from 'sonner';
import { app } from './firebase';
import axios from 'axios';
import type { AsyncServiceResponse, ServiceResponse } from '../../types/api';
import { BaseService } from './base';
import { 
  ValidationFailedError,
  NotFoundError,
  BaseError
} from '../../shared/types/error';

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

let messagingInstance: Messaging | null = null;

// Initialize messaging only if supported
const initializeMessaging = async (): Promise<boolean> => {
  try {
    if (await isSupported()) {
      messagingInstance = getMessaging(app);
      return true;
    }
    return false;
  } catch (error) {
    console.error('FCM initialization failed:', error);
    return false;
  }
};

interface FCMResponse {
  id: string;
  success: boolean;
  error?: string;
}

interface MulticastResponse {
  successCount: number;
  failureCount: number;
  responses: FCMResponse[];
}

class FCMService extends BaseService {
  private static instance: FCMService;
  private rateLimiter: {
    tokens: number;
    lastRefill: number;
    maxTokens: number;
    refillRate: number;
  };

  private constructor() {
    super();
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
      throw new ValidationFailedError([{
        field: 'token',
        message: 'Invalid FCM token format',
        type: 'format',
        code: 'VALIDATION_ERROR'
      }]);
    }
  }

  private async validatePayload(payload: NotificationPayload): Promise<void> {
    try {
      await notificationPayloadSchema.parseAsync(payload);
    } catch (error) {
      throw new ValidationFailedError([{
        field: 'payload',
        message: 'Invalid notification payload',
        type: 'format',
        code: 'VALIDATION_ERROR'
      }]);
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

  public async sendNotification(
    token: string,
    payload: NotificationPayload,
    options: SendOptions = {}
  ): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      if (!messagingInstance) {
        const supported = await initializeMessaging();
        if (!supported) {
          throw new BaseError(
            'FCM not supported in this environment',
            'INTERNAL_ERROR'
          );
        }
      }

      await this.validateToken(token);
      await this.validatePayload(payload);

      if (!(await this.checkRateLimit())) {
        throw new BaseError(
          'Rate limit exceeded',
          'INTERNAL_ERROR'
        );
      }

      const { retries, retryDelay, ...fcmOptions } = { ...DEFAULT_OPTIONS, ...options };
      
      const message = {
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
      };

      const response = await this.withRetry(
        async () => {
          const result = await axios.post<FCMResponse>('/api/notifications/send', message);
          return result.data.id;
        },
        retries,
        retryDelay
      );

      toast.success('Notification sent successfully');
      return response;
    }, { path: 'fcm/send' });
  }

  public async sendMulticast(
    tokens: string[],
    payload: NotificationPayload,
    options: SendOptions = {}
  ): Promise<ServiceResponse<MulticastResponse>> {
    return this.handleRequest(async () => {
      await Promise.all(tokens.map(token => this.validateToken(token)));
      await this.validatePayload(payload);

      if (tokens.length > 500) {
        throw new ValidationFailedError([{
          field: 'tokens',
          message: 'Maximum of 500 tokens per multicast',
          type: 'max',
          code: 'VALIDATION_ERROR'
        }]);
      }

      if (!(await this.checkRateLimit())) {
        throw new BaseError(
          'Rate limit exceeded',
          'INTERNAL_ERROR'
        );
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

      const response = await axios.post<MulticastResponse>('/api/notifications/send-multicast', message);
      return response.data;
    }, { path: 'fcm/multicast' });
  }

  public async scheduleNotification(
    token: string,
    payload: NotificationPayload,
    scheduledTime: Date,
    options: SendOptions = {}
  ): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      if (scheduledTime.getTime() <= Date.now()) {
        throw new ValidationFailedError([{
          field: 'scheduledTime',
          message: 'Scheduled time must be in the future',
          type: 'min',
          code: 'VALIDATION_ERROR'
        }]);
      }

      await this.validateToken(token);
      await this.validatePayload(payload);

      const response = await axios.post<{ id: string }>('/api/notifications/schedule', {
        token,
        payload,
        scheduledTime: scheduledTime.toISOString(),
        options
      });

      toast.success('Notification scheduled successfully');
      return response.data.id;
    }, { path: 'fcm/schedule' });
  }
}

export const fcmService = FCMService.getInstance();