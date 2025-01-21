import axios from 'axios';
import { z } from 'zod';
import { toast } from 'sonner';
import type { ChatGPTSettings, ChatGPTResponse } from '@/types/chatgpt';
import { APIError } from '@/utils/apiErrors';
import { ServiceResponse, AsyncServiceResponse, createServiceHandler } from '@/types/api';

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

class ChatGPTClient {
  private static instance: ChatGPTClient;
  private rateLimiter: RateLimiter;

  private constructor() {
    this.rateLimiter = {
      tokens: 50,
      lastRefill: Date.now(),
      maxTokens: 50,
      refillRate: 60000 // 1 minute
    };
  }

  public static getInstance(): ChatGPTClient {
    if (!ChatGPTClient.instance) {
      ChatGPTClient.instance = new ChatGPTClient();
    }
    return ChatGPTClient.instance;
  }

  private async validateSettings(settings: ChatGPTSettings): Promise<void> {
    try {
      await settingsSchema.parseAsync(settings);
    } catch (error) {
      throw new APIError(
        'INVALID_SETTINGS',
        'Invalid ChatGPT settings',
        400,
        { error }
      );
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

  public async generateResponse(
    prompt: string,
    settings: ChatGPTSettings
  ): AsyncServiceResponse<string> {
    const serviceHandler = createServiceHandler<string>();

    return serviceHandler(async () => {
      await this.validateSettings(settings);

      if (!settings.enabled) {
        throw new APIError(
          'SERVICE_DISABLED',
          'ChatGPT integration is not enabled',
          400
        );
      }

      if (!(await this.checkRateLimit())) {
        throw new APIError(
          'RATE_LIMIT_EXCEEDED',
          'Rate limit exceeded. Please try again later.',
          429
        );
      }

      try {
        const response = await axios.post<ChatGPTResponse>(
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

        const validatedResponse = responseSchema.parse(response.data);
        return validatedResponse.text;
      } catch (err) {
        const error = err as Error;
        const axiosError = err as { response?: { status?: number; data?: unknown } };
        
        throw new APIError(
          'API_ERROR',
          error.message || 'ChatGPT API request failed',
          axiosError.response?.status || 500,
          { error: axiosError.response?.data }
        );
      }
    });
  }
}

const chatGPTClient = ChatGPTClient.getInstance();

const generateHolidayGreeting = async (
  holiday: string,
  date: string,
  settings: ChatGPTSettings,
  tone: 'formal' | 'casual' = 'formal',
  language: string = 'en'
): AsyncServiceResponse<string> => {
  const serviceHandler = createServiceHandler<string>();

  return serviceHandler(async () => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Happy ${holiday}! Our office will be closed on ${date}. For emergencies, please contact 9187 4498.`;
    }

    const prompt = `Generate a ${tone} holiday greeting message for ${holiday} on ${date}.
      The message should:
      - Be ${tone} and professional
      - Mention office closure
      - Include emergency contact: 9187 4498
      - Be concise (2-3 sentences)
      ${language !== 'en' ? `- Provide translation in ${language}` : ''}`;

    const response = await chatGPTClient.generateResponse(prompt, settings);
    if (response.status === 'error' || !response.data) {
      toast.error('Failed to generate greeting message');
      throw response.error || new APIError(
        'GENERATION_ERROR',
        'Failed to generate greeting message',
        500
      );
    }
    return response.data;
  });
};

const generateRatingResponse = async (
  rating: number,
  feedback: string,
  settings: ChatGPTSettings
): AsyncServiceResponse<string> => {
  const serviceHandler = createServiceHandler<string>();

  return serviceHandler(async () => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Thank you for your ${rating}-star rating! We're glad you enjoyed our service.`;
    }

    const prompt = `Generate a personalized response to a ${rating}-star rating with the following feedback: "${feedback}".
      The response should:
      - Be grateful and professional
      - Address specific points in their feedback
      - If rating is 4-5 stars, encourage them to share on Google
      - Be concise (2-3 sentences)`;

    const response = await chatGPTClient.generateResponse(prompt, settings);
    if (response.status === 'error' || !response.data) {
      toast.error('Failed to generate response');
      throw response.error || new APIError(
        'GENERATION_ERROR',
        'Failed to generate rating response',
        500
      );
    }
    return response.data;
  });
};

export const chatGPTService = {
  generateHolidayGreeting,
  generateRatingResponse
};