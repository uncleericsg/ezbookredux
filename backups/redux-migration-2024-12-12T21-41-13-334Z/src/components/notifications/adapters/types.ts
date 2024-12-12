import { z } from 'zod';
import type { Template } from '../types/templateTypes';
import type { PreviewData, UtmParams } from '../types/messageTypes';

// Enhanced types that we want to support
export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface AnalyticsPerformance {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export interface AnalyticsData {
  impressions: number;
  clicks: number;
  conversions: number;
  performance: AnalyticsPerformance;
}

export interface PreviewConfig {
  mode: 'mobile' | 'desktop';
  sampleData: Record<string, string>;
  characterLimit: number;
  utmParams?: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  };
}

export interface EnhancedTemplate extends Template {
  readonly _enhanced: true;
  validation: ValidationResult;
  analytics: AnalyticsData;
  preview: PreviewConfig;
}

// Type guards
export const isEnhancedTemplate = (
  template: Template | EnhancedTemplate
): template is EnhancedTemplate => {
  return '_enhanced' in template;
};

export const hasValidation = (
  template: Template | EnhancedTemplate
): template is EnhancedTemplate & { validation: ValidationResult } => {
  return '_enhanced' in template && 'validation' in template;
};

export const hasAnalytics = (
  template: Template | EnhancedTemplate
): template is EnhancedTemplate & { analytics: AnalyticsData } => {
  return '_enhanced' in template && 'analytics' in template;
};
