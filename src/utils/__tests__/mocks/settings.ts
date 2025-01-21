import type { 
  AppSettings, 
  ChatGPTSettings,
  CypressSettings,
  StripeSettings,
  RepairShoprSettings
} from '@shared/types/appSettings';
import type { 
  AdminSettings,
  IntegrationSettings,
  BrandingSettings,
  ServiceSettings
} from '@shared/types/settings';

export const mockChatGPTSettings: ChatGPTSettings = {
  apiKey: '',
  model: 'gpt-3.5-turbo',
  enabled: false,
  maxTokens: 500,
  temperature: 0.7
};

export const mockCypressSettings: CypressSettings = {
  cypressApiKey: '',
  cypressEnabled: false
};

export const mockStripeSettings: StripeSettings = {
  stripePublishableKey: '',
  stripeSecretKey: '',
  stripeEnabled: false
};

export const mockRepairShoprSettings: RepairShoprSettings = {
  repairShoprApiKey: '',
  repairShoprEnabled: false,
  repairShoprFieldMappings: {},
  defaultIntervalWeeks: 11
};

export const mockIntegrationSettings: IntegrationSettings = {
  repairShopr: {
    enabled: false,
    apiKey: ''
  },
  stripe: {
    enabled: false,
    apiKey: ''
  },
  chatGPT: {
    enabled: false,
    apiKey: ''
  },
  cypress: {
    enabled: false,
    apiKey: ''
  },
  fcm: {
    enabled: false,
    apiKey: ''
  }
};

export const mockBrandingSettings: BrandingSettings = {
  logo: {
    url: '',
    width: 200,
    height: 50
  },
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#007bff'
  },
  fonts: {
    heading: 'Arial',
    body: 'Helvetica'
  }
};

export const mockAppSettings: AppSettings = {
  loginScreenEnabled: false,
  chatGPTSettings: mockChatGPTSettings,
  cypressSettings: mockCypressSettings,
  stripeSettings: mockStripeSettings,
  repairShoprSettings: mockRepairShoprSettings
};

export const mockAdminSettings: AdminSettings = {
  integrations: mockIntegrationSettings,
  branding: mockBrandingSettings,
  app: mockAppSettings
};
