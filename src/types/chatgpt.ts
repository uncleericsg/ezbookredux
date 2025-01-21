export interface ChatGPTSettings {
  apiKey: string;
  model: string;
  enabled: boolean;
  maxTokens: number;
  temperature: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

export interface ChatGPTResponse {
  text: string;
  usage: {
    total_tokens: number;
  };
}