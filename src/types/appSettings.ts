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

export interface CypressSettings {
  cypressApiKey?: string;
  cypressEnabled?: boolean;
}

export interface StripeSettings {
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  stripeEnabled?: boolean;
}

export interface RepairShoprSettings {
  repairShoprApiKey?: string;
  repairShoprEnabled?: boolean;
  repairShoprFieldMappings?: Record<string, string>;
  defaultIntervalWeeks?: number;
}

export interface AppSettings {
  loginScreenEnabled: boolean;
  chatGPTSettings?: ChatGPTSettings;
  cypressSettings?: CypressSettings;
  stripeSettings?: StripeSettings;
  repairShoprSettings?: RepairShoprSettings;
}

export const defaultAppSettings: AppSettings = {
  loginScreenEnabled: false,
  chatGPTSettings: {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    enabled: false,
    maxTokens: 500,
    temperature: 0.7,
    rateLimit: {
      maxRequests: 50,
      windowMs: 60000 // 1 minute
    }
  },
  cypressSettings: {
    cypressApiKey: '',
    cypressEnabled: false
  },
  stripeSettings: {
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeEnabled: false
  },
  repairShoprSettings: {
    repairShoprApiKey: '',
    repairShoprEnabled: false,
    repairShoprFieldMappings: {},
    defaultIntervalWeeks: 11
  }
};
