export interface ChatGPTSettings {
  enabled: boolean;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  customInstructions?: string;
  language?: string;
  tonePreference?: 'formal' | 'casual';
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    dailyLimit?: number;
    templates?: Record<string, string>;
  };
  sms: {
    enabled: boolean;
    dailyLimit?: number;
    provider?: string;
    templates?: Record<string, string>;
  };
  push: {
    enabled: boolean;
    dailyLimit?: number;
    fcmConfig?: {
      projectId: string;
      privateKey: string;
      clientEmail: string;
    };
  };
}

export interface UserSettings {
  id: string;
  userId: string;
  notifications: NotificationSettings;
  chatgpt: ChatGPTSettings;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  notifications?: Partial<NotificationSettings>;
  chatgpt?: Partial<ChatGPTSettings>;
  timezone?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface BrandingSettings {
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  companyName: string;
  contactEmail: string;
}

export interface AdminSettings extends UserSettings {
  role: 'admin' | 'superadmin';
  permissions: string[];
  features: {
    analytics: boolean;
    userManagement: boolean;
    settingsManagement: boolean;
    systemMonitoring: boolean;
  };
  branding: BrandingSettings;
}

export const defaultBrandingSettings: BrandingSettings = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    accent: '#28a745'
  },
  fonts: {
    primary: 'Inter',
    secondary: 'Roboto'
  },
  companyName: 'iAircon',
  contactEmail: 'support@iaircon.com'
};

export const defaultSettings: UserSettings = {
  id: '',
  userId: '',
  notifications: {
    email: {
      enabled: true,
      dailyLimit: 100
    },
    sms: {
      enabled: true,
      dailyLimit: 50
    },
    push: {
      enabled: true,
      dailyLimit: 100
    }
  },
  chatgpt: {
    enabled: false,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    language: 'en',
    tonePreference: 'formal'
  },
  timezone: 'UTC',
  language: 'en',
  theme: 'system',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};