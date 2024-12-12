import type { Template } from '../types/templateTypes';
import type { 
  EnhancedTemplate, 
  ValidationResult, 
  AnalyticsData,
  PreviewConfig 
} from './types';
import { MESSAGE_LIMITS } from '../constants/templateConstants';

export class TemplateAdapter {
  /**
   * Convert a legacy template to an enhanced template
   */
  static enhance(template: Template | EnhancedTemplate): EnhancedTemplate {
    // Return if already enhanced
    if ((template as EnhancedTemplate)._enhanced) {
      return template as EnhancedTemplate;
    }

    return {
      ...template,
      _enhanced: true,
      validation: this.createDefaultValidation(),
      analytics: this.createDefaultAnalytics(),
      preview: this.createDefaultPreview(template)
    };
  }

  /**
   * Convert an enhanced template back to a legacy template
   */
  static toLegacy(template: EnhancedTemplate): Template {
    const { _enhanced, validation, analytics, preview, ...legacyTemplate } = template;
    return legacyTemplate;
  }

  /**
   * Create default validation result
   */
  private static createDefaultValidation(): ValidationResult {
    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  }

  /**
   * Create default analytics data
   */
  private static createDefaultAnalytics(): AnalyticsData {
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      performance: {
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0
      }
    };
  }

  /**
   * Create default preview configuration
   */
  private static createDefaultPreview(template: Template): PreviewConfig {
    return {
      mode: 'desktop',
      sampleData: {},
      characterLimit: MESSAGE_LIMITS[template.type] || 1000,
      utmParams: {
        utmSource: '',
        utmMedium: '',
        utmCampaign: ''
      }
    };
  }

  /**
   * Update template validation
   */
  static updateValidation(
    template: EnhancedTemplate,
    validation: Partial<ValidationResult>
  ): EnhancedTemplate {
    return {
      ...template,
      validation: {
        ...template.validation,
        ...validation
      }
    };
  }

  /**
   * Update template analytics
   */
  static updateAnalytics(
    template: EnhancedTemplate,
    analytics: Partial<AnalyticsData>
  ): EnhancedTemplate {
    return {
      ...template,
      analytics: {
        ...template.analytics,
        ...analytics,
        performance: {
          ...template.analytics.performance,
          ...(analytics.performance || {})
        }
      }
    };
  }
}
