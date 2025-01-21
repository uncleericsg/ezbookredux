import type { AdminSettings } from '../shared/types/settings';

export const defaultSettings: AdminSettings = {
  integrations: {
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
      enabled: false,
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.7
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
