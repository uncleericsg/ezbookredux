import { Template } from '../types/templateTypes';
import { PreviewConfig } from '../types/messageTypes';
import { PreviewAdapter } from './previewAdapter';

export class ValidationAdapter {
  private previewAdapter: PreviewAdapter;

  constructor() {
    this.previewAdapter = new PreviewAdapter();
  }

  validate(template: Template, config: PreviewConfig): string[] {
    const errors: string[] = [];

    // Basic template validation
    if (!template.name) {
      errors.push('Template name is required');
    }

    if (!template.content) {
      errors.push('Template content is required');
    }

    if (!template.type) {
      errors.push('Template type is required');
    }

    // Content validation
    if (template.content) {
      // Check character limits
      const contentErrors = this.previewAdapter.validateMessage(template.content, config);
      errors.push(...contentErrors);

      // Check variable syntax
      const variableErrors = this.validateVariables(template.content);
      errors.push(...variableErrors);
    }

    return errors;
  }

  private validateVariables(content: string): string[] {
    const errors: string[] = [];
    const variableRegex = /{{([^}]+)}}/g;
    const matches = content.matchAll(variableRegex);
    const variables = new Set<string>();

    for (const match of matches) {
      const variable = match[1].trim();

      // Check for empty variables
      if (!variable) {
        errors.push('Empty variable placeholder found');
        continue;
      }

      // Check for invalid characters
      if (!/^[a-zA-Z0-9_]+$/.test(variable)) {
        errors.push(`Invalid variable name: ${variable} (only letters, numbers, and underscores allowed)`);
      }

      // Check for duplicates
      if (variables.has(variable)) {
        errors.push(`Duplicate variable: ${variable}`);
      }

      variables.add(variable);
    }

    return errors;
  }

  validatePreviewConfig(config: PreviewConfig): string[] {
    const errors: string[] = [];

    if (!config.mode) {
      errors.push('Preview mode is required');
    }

    if (config.characterLimit <= 0) {
      errors.push('Character limit must be greater than 0');
    }

    if (config.utmParams) {
      if (!config.utmParams.utmSource) {
        errors.push('UTM source is required when UTM parameters are provided');
      }
      if (!config.utmParams.utmMedium) {
        errors.push('UTM medium is required when UTM parameters are provided');
      }
      if (!config.utmParams.utmCampaign) {
        errors.push('UTM campaign is required when UTM parameters are provided');
      }
    }

    return errors;
  }
}
