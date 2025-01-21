export interface ServiceSettings {
  enabled: boolean;
  apiKey: string;
}

export interface ChatGPTSettings extends ServiceSettings {
  model: string;
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

export interface IntegrationSettings {
  repairShopr: ServiceSettings;
  stripe: ServiceSettings;
  chatGPT: ServiceSettings;
  cypress: ServiceSettings;
  fcm: ServiceSettings;
}

export interface LogoSettings {
  url: string;
  width: number;
  height: number;
}

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
}

export interface FontSettings {
  heading: string;
  body: string;
}

export interface BrandingSettings {
  logo: LogoSettings;
  colors: ColorSettings;
  fonts: FontSettings;
}

export interface AppSettings {
  loginScreenEnabled: boolean;
  chatGPTSettings: ChatGPTSettings;
  cypressSettings: CypressSettings;
  stripeSettings: StripeSettings;
  repairShoprSettings: RepairShoprSettings;
}

export interface AdminSettings {
  integrations: IntegrationSettings;
  branding: BrandingSettings;
  app: AppSettings;
}

export interface SettingsUpdateResult {
  success: boolean;
  error?: string;
}

export interface SettingsValidationError {
  field: string;
  message: string;
}

export interface SettingsValidationResult {
  valid: boolean;
  errors?: SettingsValidationError[];
}

export type SettingsChangeHandler<T> = (settings: Partial<T>) => Promise<void>;

export type SettingsValidator<T> = (settings: T) => SettingsValidationResult;
