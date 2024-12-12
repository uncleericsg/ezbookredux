export interface PreviewData {
  [key: string]: string | number | boolean;
}

export interface UtmParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export interface CharacterCount {
  current: number;
  limit: number;
  remaining: number;
  isOverLimit: boolean;
}

export interface PreviewConfig {
  mode: 'desktop' | 'mobile';
  sampleData: PreviewData;
  characterLimit: number;
  utmParams: UtmParams;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: 'sms' | 'email' | 'whatsapp';
  characterLimit: number;
}

export interface MessageFeatures {
  readonly _enhanced?: boolean;
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  analytics?: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
}

export const MESSAGE_LIMITS = {
  sms: 160,
  whatsapp: 1000,
  email: 5000
} as const;

export type MessageType = keyof typeof MESSAGE_LIMITS;
