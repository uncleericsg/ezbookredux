import { z } from 'zod';
import { TEMPLATE_TYPES } from '../constants/templateConstants';

export type TemplateType = typeof TEMPLATE_TYPES[keyof typeof TEMPLATE_TYPES];

export interface PreviewData {
  [key: string]: string;
}

export interface PreviewConfig {
  mode: 'desktop' | 'mobile';
  sampleData: PreviewData;
  characterLimit: number;
  utmParams?: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  };
}

export const previewConfigSchema = z.object({
  mode: z.enum(['desktop', 'mobile']),
  sampleData: z.record(z.string()),
  characterLimit: z.number().min(1),
  utmParams: z.object({
    utmSource: z.string(),
    utmMedium: z.string(),
    utmCampaign: z.string()
  }).optional()
});

export interface MessageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const messageValidationSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string())
});

export interface ProcessedMessage {
  content: string;
  characterCount: number;
  variables: string[];
  validation: MessageValidation;
}

export const processedMessageSchema = z.object({
  content: z.string(),
  characterCount: z.number(),
  variables: z.array(z.string()),
  validation: messageValidationSchema
});
