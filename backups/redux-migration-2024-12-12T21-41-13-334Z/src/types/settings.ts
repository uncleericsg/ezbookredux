export interface AcuitySettings {
  apiKey: string;
  userId: string;
  enabled: boolean;
  defaultIntervalWeeks: number;
  repairShoprApiKey?: string;
  loginScreenEnabled?: boolean;
  repairShoprEnabled?: boolean;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  stripeEnabled?: boolean;
  chatGPTSettings?: ChatGPTSettings;
  cypressApiKey?: string;
  cypressEnabled?: boolean;
  fcmSettings?: {
    enabled: boolean;
    maxTokens: number;
    rateLimit: {
      maxRequests: number;
      windowMs: number;
    };
  };
}

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

export const defaultSettings: AcuitySettings = {
  apiKey: '',
  userId: '',
  enabled: true,
  loginScreenEnabled: false,
  defaultIntervalWeeks: 11, // 75 days ≈ 11 weeks
  repairShoprApiKey: '',
  repairShoprEnabled: false,
  stripePublishableKey: '',
  stripeSecretKey: '',
  stripeEnabled: false,
  chatGPTSettings: {
    apiKey: '',
    model: 'gpt-4',
    enabled: false,
    maxTokens: 500,
    temperature: 0.7,
    rateLimit: {
      maxRequests: 50,
      windowMs: 60000 // 1 minute
    }
  },
  fcmSettings: {
    enabled: false,
    maxTokens: 500,
    rateLimit: {
      maxRequests: 500,
      windowMs: 60000 // 1 minute
    }
  },
  cypressApiKey: '',
  cypressEnabled: false
};