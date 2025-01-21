import { z } from 'zod';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import admin from 'firebase-admin';
import type {
  NotificationPayload,
  SendOptions,
  MulticastResponse,
  FCMService as IFCMService,
  FCMPlatformOptions,
  SendResponse,
  FCMError
} from '@shared/types/notification';

// Validation schemas
const fcmTokenSchema = z.string().regex(/^[A-Za-z0-9-_]+$/);

const notificationPayloadSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(4096),
  data: z.record(z.string()).optional(),
  imageUrl: z.string().url().optional()
});

const DEFAULT_OPTIONS: Required<Pick<SendOptions, 'retries' | 'retryDelay'>> = {
  retries: 3,
  retryDelay: 1000
};

interface RateLimiter {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number;
}

export class FCMService implements IFCMService {
  private static instance: FCMService;
  private messaging: admin.messaging.Messaging;
  private rateLimiter: RateLimiter;

  private constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }
    this.messaging = admin.messaging();
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
      logger.error('Invalid FCM token', { error: String(error) });
      throw new ApiError('Invalid FCM token format', 'VALIDATION_ERROR');
    }
  }

  private async validatePayload(payload: NotificationPayload): Promise<void> {
    try {
      await notificationPayloadSchema.parseAsync(payload);
    } catch (error) {
      logger.error('Invalid notification payload', { error: String(error) });
      throw new ApiError('Invalid notification payload', 'VALIDATION_ERROR');
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
      throw new ApiError('FCM rate limit exceeded', 'VALIDATION_ERROR');
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

  private createPlatformOptions(options: SendOptions): FCMPlatformOptions {
    return {
      android: {
        priority: options.priority === 'high' ? 'high' : 'normal',
        ttl: options.timeToLive ? options.timeToLive * 1000 : undefined,
        collapseKey: options.collapseKey
      },
      apns: {
        headers: {
          'apns-priority': options.priority === 'high' ? '10' : '5',
          'apns-collapse-id': options.collapseKey
        }
      }
    };
  }

  private mapSendResponse(response: admin.messaging.SendResponse): SendResponse {
    return {
      success: response.success,
      messageId: response.messageId || undefined,
      error: response.error ? {
        code: response.error.code,
        message: response.error.message
      } : undefined
    };
  }

  public async sendNotification(
    token: string,
    payload: NotificationPayload,
    options: SendOptions = {}
  ): Promise<string> {
    try {
      await this.validateToken(token);
      await this.validatePayload(payload);
      await this.checkRateLimit();

      const { retries, retryDelay } = { ...DEFAULT_OPTIONS, ...options };
      const platformOptions = this.createPlatformOptions(options);
      
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl
        },
        data: payload.data,
        android: platformOptions.android,
        apns: platformOptions.apns
      };

      const response = await this.retryOperation(
        () => this.messaging.send(message),
        { retries, retryDelay }
      );

      logger.info('Notification sent successfully', { token });
      return response;
    } catch (error) {
      logger.error('FCM send error', { error: String(error), token });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to send notification', 'INTERNAL_SERVER_ERROR');
    }
  }

  public async sendMulticast(
    tokens: string[],
    payload: NotificationPayload,
    options: SendOptions = {}
  ): Promise<MulticastResponse> {
    try {
      await Promise.all(tokens.map(token => this.validateToken(token)));
      await this.validatePayload(payload);
      await this.checkRateLimit();

      if (tokens.length > 500) {
        throw new ApiError('Maximum of 500 tokens per multicast', 'VALIDATION_ERROR');
      }

      const platformOptions = this.createPlatformOptions(options);
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl
        },
        data: payload.data,
        android: platformOptions.android,
        apns: platformOptions.apns
      };

      // Send messages in batches of 500
      const responses = await Promise.all(
        Array.from({ length: Math.ceil(tokens.length / 500) }, (_, i) => {
          const batchTokens = tokens.slice(i * 500, (i + 1) * 500);
          return this.messaging.sendEach(batchTokens.map(token => ({
            token,
            notification: message.notification,
            data: message.data,
            android: message.android,
            apns: message.apns
          })));
        })
      );

      // Combine batch responses
      const combined = responses.reduce((acc, res) => ({
        successCount: acc.successCount + res.successCount,
        failureCount: acc.failureCount + res.failureCount,
        responses: [...acc.responses, ...res.responses]
      }), {
        successCount: 0,
        failureCount: 0,
        responses: [] as admin.messaging.SendResponse[]
      });

      logger.info('Multicast notification sent', { 
        tokenCount: tokens.length,
        successCount: combined.successCount,
        failureCount: combined.failureCount
      });

      return {
        successCount: combined.successCount,
        failureCount: combined.failureCount,
        responses: combined.responses.map(this.mapSendResponse)
      };
    } catch (error) {
      logger.error('FCM multicast error', { error: String(error), tokenCount: tokens.length });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to send multicast notification', 'INTERNAL_SERVER_ERROR');
    }
  }
}

export const fcmService = FCMService.getInstance();
