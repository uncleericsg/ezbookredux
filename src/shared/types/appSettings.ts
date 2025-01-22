export interface ChatGPTSettings {
  apiKey: string;
  model: string;
  enabled: boolean;
  maxTokens: number;
  temperature: number;
}

export interface CypressSettings {
  cypressApiKey: string;
  cypressEnabled: boolean;
}

export interface StripeSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeEnabled: boolean;
}

export interface RepairShoprSettings {
  repairShoprApiKey: string;
  repairShoprEnabled: boolean;
  repairShoprFieldMappings: Record<string, string>;
  defaultIntervalWeeks: number;
}

export interface AppSettings {
  loginScreenEnabled: boolean;
  chatGPTSettings: ChatGPTSettings;
  cypressSettings: CypressSettings;
  stripeSettings: StripeSettings;
  repairShoprSettings: RepairShoprSettings;
}