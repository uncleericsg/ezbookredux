import DOMPurify from 'dompurify';
import type { Template } from '../types/templateTypes';
import type { PreviewConfig, PreviewData, UtmParams, CharacterCount } from '../types/messageTypes';
import { MESSAGE_LIMITS } from '../constants/templateConstants';

export class PreviewAdapter {
  /**
   * Process message with preview data and sanitize HTML
   */
  processMessage(message: string, config: PreviewConfig): string {
    let processed = message;

    if (config.sampleData) {
      Object.entries(config.sampleData).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        processed = processed.replace(regex, value.toString());
      });
    }

    return DOMPurify.sanitize(processed);
  }

  /**
   * Create preview configuration with defaults
   */
  createPreviewConfig(
    template: Template,
    mode: 'desktop' | 'mobile' = 'desktop',
    sampleData: PreviewData = {},
    utmParams?: UtmParams
  ): PreviewConfig {
    return {
      mode,
      sampleData,
      characterLimit: MESSAGE_LIMITS[template.type] || 1000,
      utmParams: utmParams || {
        utmSource: 'preview',
        utmMedium: template.type,
        utmCampaign: template.title
      }
    };
  }

  /**
   * Get character count information
   */
  getCharacterCount(message: string, limit: number): CharacterCount {
    const current = message.length;
    const remaining = limit - current;
    
    return {
      current,
      limit,
      remaining,
      isOverLimit: current > limit
    };
  }

  /**
   * Format phone number based on length
   */
  formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11) {
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone;
  }

  /**
   * Generate URL with UTM parameters
   */
  generateUrl(baseUrl: string, utmParams: UtmParams): string {
    const params = new URLSearchParams({
      utm_source: utmParams.utmSource,
      utm_medium: utmParams.utmMedium,
      utm_campaign: utmParams.utmCampaign
    });

    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`;
  }
}

export function processTemplate(template: string, data: Record<string, any> = {}) {
  let processedTemplate = template;

  // Replace variables in the format {{variableName}}
  const variableRegex = /\{\{([^}]+)\}\}/g;
  processedTemplate = processedTemplate.replace(variableRegex, (match, variable) => {
    const value = data[variable.trim()];
    return value !== undefined ? value : match;
  });

  return processedTemplate;
}

export function validateTemplate(template: string): string[] {
  const errors: string[] = [];
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const matches = template.match(variableRegex) || [];

  // Check for duplicate variables
  const variables = matches.map(match => match.slice(2, -2).trim());
  const duplicates = variables.filter((item, index) => variables.indexOf(item) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate variables found: ${[...new Set(duplicates)].join(', ')}`);
  }

  // Check for empty variables
  const emptyVariables = variables.filter(variable => !variable);
  if (emptyVariables.length > 0) {
    errors.push('Empty variable placeholders found');
  }

  // Check for malformed variables (unclosed braces)
  const unclosedBraces = (template.match(/\{\{/g) || []).length !== (template.match(/\}\}/g) || []).length;
  if (unclosedBraces) {
    errors.push('Unclosed variable placeholders found');
  }

  return errors;
}
