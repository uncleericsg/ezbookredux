import axios from 'axios';
import { z } from 'zod';
import { toast } from 'sonner';
import type { ChatGPTSettings, ChatGPTResponse } from '@/types/chatgpt';
import type { AsyncServiceResponse, ServiceResponse } from '../../types/api';
import { BaseService } from './base';
import { 
  ValidationFailedError,
  BaseError
} from '../../shared/types/error';

// Validation schemas
const responseSchema = z.object({
  text: z.string(),
  usage: z.object({
    total_tokens: z.number()
  })
});

const settingsSchema = z.object({
  apiKey: z.string().min(1),
  model: z.string().min(1),
  enabled: z.boolean(),
  maxTokens: z.number().min(1).max(4000),
  temperature: z.number().min(0).max(1),
  rateLimit: z.object({
    maxRequests: z.number(),
    windowMs: z.number()
  }).optional()
});

interface RateLimiter {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number;
}

const API_ENDPOINT = import.meta.env.VITE_CHATGPT_API_ENDPOINT || '/api/chatgpt';

class ChatGPTService extends BaseService {
  private static instance: ChatGPTService;
  private rateLimiter: RateLimiter;

  private constructor() {
    super();
    this.rateLimiter = {
      tokens: 50,
      lastRefill: Date.now(),
      maxTokens: 50,
      refillRate: 60000 // 1 minute
    };
  }

  public static getInstance(): ChatGPTService {
    if (!ChatGPTService.instance) {
      ChatGPTService.instance = new ChatGPTService();
    }
    return ChatGPTService.instance;
  }

  private async validateSettings(settings: ChatGPTSettings): Promise<void> {
    try {
      await settingsSchema.parseAsync(settings);
    } catch (error) {
      throw new ValidationFailedError([{
        field: 'settings',
        message: 'Invalid ChatGPT settings',
        type: 'validation',
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
      return false;
    }

    this.rateLimiter.tokens--;
    return true;
  }

  private async generateResponse(
    prompt: string,
    settings: ChatGPTSettings
  ): Promise<string> {
    await this.validateSettings(settings);

    if (!settings.enabled) {
      throw new BaseError(
        'ChatGPT integration is not enabled',
        'VALIDATION_ERROR'
      );
    }

    if (!(await this.checkRateLimit())) {
      throw new BaseError(
        'Rate limit exceeded. Please try again later.',
        'INTERNAL_ERROR'
      );
    }

    try {
      const response = await this.withRetry(
        async () => {
          const result = await axios.post<ChatGPTResponse>(
            `${API_ENDPOINT}/generate`,
            {
              prompt,
              model: settings.model,
              maxTokens: settings.maxTokens,
              temperature: settings.temperature
            },
            {
              headers: {
                'Authorization': `Bearer ${settings.apiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          return responseSchema.parse(result.data);
        },
        3,
        1000
      );

      return response.text;
    } catch (err) {
      const error = err as Error;
      const axiosError = err as { response?: { status?: number; data?: unknown } };
      
      throw new BaseError(
        error.message || 'ChatGPT API request failed',
        'INTERNAL_ERROR',
        { error: axiosError.response?.data }
      );
    }
  }

  async generateHolidayGreeting(
    holiday: string,
    date: string,
    settings: ChatGPTSettings,
    tone: 'formal' | 'casual' = 'formal',
    language: string = 'en'
  ): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      if (import.meta.env.DEV) {
        return `Happy ${holiday}! Our office will be closed on ${date}. For emergencies, please contact 9187 4498.`;
      }

      const prompt = `Generate a ${tone} holiday greeting message for ${holiday} on ${date}.
        The message should:
        - Be ${tone} and professional
        - Mention office closure
        - Include emergency contact: 9187 4498
        - Be concise (2-3 sentences)
        ${language !== 'en' ? `- Provide translation in ${language}` : ''}`;

      try {
        const response = await this.generateResponse(prompt, settings);
        return response;
      } catch (error) {
        toast.error('Failed to generate greeting message');
        throw error;
      }
    }, { path: 'chatgpt/holiday-greeting' });
  }

  async generateRatingResponse(
    rating: number,
    feedback: string,
    settings: ChatGPTSettings
  ): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      if (import.meta.env.DEV) {
        return `Thank you for your ${rating}-star rating! We're glad you enjoyed our service.`;
      }

      const prompt = `Generate a personalized response to a ${rating}-star rating with the following feedback: "${feedback}".
        The response should:
        - Be grateful and professional
        - Address specific points in their feedback
        - If rating is 4-5 stars, encourage them to share on Google
        - Be concise (2-3 sentences)`;

      try {
        const response = await this.generateResponse(prompt, settings);
        return response;
      } catch (error) {
        toast.error('Failed to generate response');
        throw error;
      }
    }, { path: 'chatgpt/rating-response' });
  }
}

// Create singleton instance
export const chatGPTService = ChatGPTService.getInstance();