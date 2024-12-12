import type { Template } from '../types/templateTypes';
import type { ValidationResult, ValidationError, ValidationWarning } from './types';
import { MESSAGE_LIMITS, TEMPLATE_TYPES } from '../constants/templateConstants';

export class ValidationAdapter {
  /**
   * Validate a template and return validation result
   */
  static validate(template: Template): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check required fields
    if (!template.title?.trim()) {
      errors.push({
        code: 'REQUIRED_FIELD',
        message: 'Title is required',
        field: 'title'
      });
    }

    if (!template.message?.trim()) {
      errors.push({
        code: 'REQUIRED_FIELD',
        message: 'Message is required',
        field: 'message'
      });
    }

    if (!template.type || !Object.values(TEMPLATE_TYPES).includes(template.type)) {
      errors.push({
        code: 'REQUIRED_FIELD',
        message: 'Valid template type is required',
        field: 'type'
      });
      return {
        isValid: false,
        errors,
        warnings
      };
    }

    // Check message length
    if (template.message?.trim()) {
      const limit = MESSAGE_LIMITS[template.type as keyof typeof MESSAGE_LIMITS];
      if (template.message.length > limit) {
        errors.push({
          code: 'MESSAGE_TOO_LONG',
          message: `Message exceeds ${limit} characters`,
          field: 'message',
          limit
        });
      }

      // Extract and validate variables
      const variables = this.extractVariables(template.message);
      const uniqueVariables = [...new Set(variables)];
      
      // Check for duplicates
      if (variables.length > uniqueVariables.length) {
        const variableCounts = variables.reduce((acc, v) => {
          acc[v] = (acc[v] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const duplicates = Object.entries(variableCounts)
          .filter(([_, count]) => count > 1)
          .map(([name]) => name);

        warnings.push({
          code: 'DUPLICATE_VARIABLES',
          message: `Duplicate variables found: ${duplicates.join(', ')}`,
          field: 'message',
          variables: duplicates
        });
      }

      // Check for invalid variable names
      const invalidVars = variables.filter(v => !this.isValidVariableName(v));
      if (invalidVars.length > 0) {
        errors.push({
          code: 'INVALID_VARIABLES',
          message: `Invalid variable names found: ${invalidVars.join(', ')}`,
          field: 'message',
          variables: invalidVars
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Extract variables from message
   */
  static extractVariables(message: string): string[] {
    const matches = message.match(/\{([^}]+)\}/g) || [];
    return matches.map(match => match.slice(1, -1));
  }

  /**
   * Check if variable name is valid
   */
  private static isValidVariableName(name: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name);
  }
}
