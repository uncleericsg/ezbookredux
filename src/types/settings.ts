import { AppSettings } from './appSettings';

export interface ServiceSettings {
  enabled: boolean;
  apiKey?: string;
  maxTokens?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

export interface IntegrationSettings {
  repairShopr: ServiceSettings;
  stripe: ServiceSettings;
  chatGPT: ServiceSettings;
  cypress: ServiceSettings;
  fcm: ServiceSettings;
}

export interface BrandingSettings {
  logo: {
    url: string;
    width: number;
    height: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface RepairShoprSettings {
  repairShoprApiKey: string;
  repairShoprEnabled: boolean;
  repairShoprFieldMappings: Record<string, string>;
  defaultIntervalWeeks: number;
}

export interface AdminSettings {
  integrations: IntegrationSettings;
  branding: BrandingSettings;
  app: AppSettings;
}

export const defaultSettings: AdminSettings = {
  integrations: {
    repairShopr: {
      enabled: false,
      apiKey: '',
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },
    stripe: {
      enabled: false,
      apiKey: '',
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },
    chatGPT: {
      enabled: false,
      apiKey: '',
      maxTokens: 500,
      rateLimit: {
        maxRequests: 50,
        windowMs: 60000
      }
    },
    cypress: {
      enabled: false,
      apiKey: '',
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },
    fcm: {
      enabled: false,
      maxTokens: 500,
      rateLimit: {
        maxRequests: 500,
        windowMs: 60000
      }
    }
  },
  branding: {
    logo: {
      url: '/logo.png',
      width: 200,
      height: 50
    },
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#ffd700'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  },
  app: {
    loginScreenEnabled: false,
    chatGPTSettings: {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      enabled: false,
      maxTokens: 500,
      temperature: 0.7,
      rateLimit: {
        maxRequests: 50,
        windowMs: 60000
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
  }
};