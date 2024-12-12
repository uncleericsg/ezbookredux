import { z } from 'zod';

export const templateUserTypes = ['all', 'amc', 'regular'] as const;
export type TemplateUserType = typeof templateUserTypes[number];

export interface TemplateFeatures {
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
  preview?: {
    mode: 'mobile' | 'desktop';
    sampleData: Record<string, string>;
    characterLimit: number;
  };
}

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Template name is required'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content is too long'),
  userType: z.enum(templateUserTypes),
  variables: z.array(z.string()),
  version: z.string(),
  lastModified: z.string(),
  createdBy: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).optional(),
  features: z.object({
    _enhanced: z.boolean().optional(),
    validation: z.object({
      isValid: z.boolean().optional(),
      errors: z.array(z.string()).optional(),
      warnings: z.array(z.string()).optional()
    }).optional(),
    analytics: z.object({
      impressions: z.number().optional(),
      clicks: z.number().optional(),
      conversions: z.number().optional()
    }).optional(),
    preview: z.object({
      mode: z.enum(['mobile', 'desktop']).optional(),
      sampleData: z.record(z.string()).optional(),
      characterLimit: z.number().optional()
    }).optional()
  }).optional()
});

export type Template = z.infer<typeof templateSchema> & Partial<TemplateFeatures>;

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[] | null;
}

export interface TemplateVersion {
  version: string;
  content: string;
  modifiedBy: string;
  modifiedAt: string;
  comment?: string;
}
