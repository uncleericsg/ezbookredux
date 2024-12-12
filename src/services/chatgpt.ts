import axios from 'axios';
import { z } from 'zod';
import { toast } from 'sonner';
import type { ChatGPTSettings } from '../types/settings';

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

class ChatGPTClient {
  private static instance: ChatGPTClient;
  private rateLimiter: RateLimiter;
  private API_ENDPOINT = import.meta.env.DEV ? '/api/chatgpt' : process.env.CHATGPT_API_ENDPOINT;

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
      throw new Error('Invalid ChatGPT settings');
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
  ): Promise<string> {
    try {
      await this.validateSettings(settings);

      if (!settings.enabled) {
        throw new Error('ChatGPT integration is not enabled');
      }

      if (!(await this.checkRateLimit())) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const response = await axios.post(`${this.API_ENDPOINT}/generate`, {
        prompt,
        model: settings.model,
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const validatedResponse = responseSchema.parse(response.data);
      return validatedResponse.text;
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw error;
    }
  }
}

const chatGPTClient = ChatGPTClient.getInstance();

interface ChatGPTResponse {
  text: string;
  usage: {
    total_tokens: number;
  };
}

const API_ENDPOINT = import.meta.env.DEV ? '/api/chatgpt' : process.env.CHATGPT_API_ENDPOINT;

const generateHolidayGreeting = async (
  holiday: string,
  date: string,
  settings: ChatGPTSettings,
  tone: 'formal' | 'casual' = 'formal',
  language: string = 'en'
): Promise<string> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Happy ${holiday}! Our office will be closed on ${date}. For emergencies, please contact 9187 4498.`;
  }

  try {
    const prompt = `Generate a ${tone} holiday greeting message for ${holiday} on ${date}.
      The message should:
      - Be ${tone} and professional
      - Mention office closure
      - Include emergency contact: 9187 4498
      - Be concise (2-3 sentences)
      ${language !== 'en' ? `- Provide translation in ${language}` : ''}`;

    return await chatGPTClient.generateResponse(prompt, settings);
  } catch (error) {
    console.error('Failed to generate holiday greeting:', error);
    toast.error('Failed to generate greeting message');
    throw error;
  }
};

const generateRatingResponse = async (
  rating: number,
  feedback: string,
  settings: ChatGPTSettings
): Promise<string> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Thank you for your ${rating}-star rating! We're glad you enjoyed our service.`;
  }

  try {
    const prompt = `Generate a personalized response to a ${rating}-star rating with the following feedback: "${feedback}".
      The response should:
      - Be grateful and professional
      - Address specific points in their feedback
      - If rating is 4-5 stars, encourage them to share on Google
      - Be concise (2-3 sentences)`;

    return await chatGPTClient.generateResponse(prompt, settings);
  } catch (error) {
    console.error('Failed to generate rating response:', error);
    toast.error('Failed to generate response');
    throw error;
  }
};

export const chatGPTService = {
  generateHolidayGreeting,
  generateRatingResponse
};