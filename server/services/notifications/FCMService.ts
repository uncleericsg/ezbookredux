import { z } from 'zod';
import { logger } from '@server/utils/logger';
import { createApiError } from '@server/utils/apiResponse';
import admin from 'firebase-admin';

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

export class FCMService {
	private static instance: FCMService;
	private messaging: admin.messaging.Messaging;
	private rateLimiter: {
		tokens: number;
		lastRefill: number;
		maxTokens: number;
		refillRate: number;
	};

	private constructor() {
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
			logger.error('Invalid FCM token:', error);
			throw createApiError('Invalid FCM token format', 'VALIDATION_ERROR');
		}
	}

	private async validatePayload(payload: NotificationPayload): Promise<void> {
		try {
			await notificationPayloadSchema.parseAsync(payload);
		} catch (error) {
			logger.error('Invalid notification payload:', error);
			throw createApiError('Invalid notification payload', 'VALIDATION_ERROR');
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
			throw createApiError('FCM rate limit exceeded', 'RATE_LIMIT_EXCEEDED');
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
			await this.validateToken(token);
			await this.validatePayload(payload);
			await this.checkRateLimit();

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

			const response = await this.retryOperation(
				() => this.messaging.send(message),
				{ retries, retryDelay }
			);

			logger.info('Notification sent successfully');
			return response;
		} catch (error) {
			logger.error('FCM send error:', error);
			throw createApiError('Failed to send notification', 'SERVER_ERROR');
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
			await this.checkRateLimit();

			if (tokens.length > 500) {
				throw createApiError('Maximum of 500 tokens per multicast', 'VALIDATION_ERROR');
			}

			const message = {
				tokens,
				notification: {
					title: payload.title,
					body: payload.body,
					imageUrl: payload.imageUrl
				},
				data: payload.data,
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

			return await this.messaging.sendMulticast(message);
		} catch (error) {
			logger.error('FCM multicast error:', error);
			throw createApiError('Failed to send multicast notification', 'SERVER_ERROR');
		}
	}
}

export const fcmService = FCMService.getInstance();