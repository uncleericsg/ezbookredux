import { useMemo, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { Template, TemplateVariable } from '../types/templateTypes';

interface ProcessingResult {
  processedMessage: string;
  charCount: number;
  variables: TemplateVariable[];
  hasErrors: boolean;
  errors: string[];
  sanitizedMessage: string;
}

export const useTemplateProcessing = (
  template: Template,
  sampleData: Record<string, string>
): ProcessingResult => {
  // Extract variables from template message
  const extractVariables = useCallback((message: string): TemplateVariable[] => {
    const matches = message.match(/\{(\w+)\}/g) || [];
    return [...new Set(matches)].map(match => ({
      key: match.slice(1, -1),
      value: '',
      required: true,
      description: `Variable for ${match.slice(1, -1)}`
    }));
  }, []);

  // Check for missing required variables
  const findMissingVariables = useCallback((
    message: string,
    data: Record<string, string>
  ): string[] => {
    const variables = extractVariables(message);
    return variables
      .filter(v => v.required && !data[v.key])
      .map(v => v.key);
  }, [extractVariables]);

  // Process message with variable substitution
  const processMessage = useCallback((
    message: string,
    data: Record<string, string>
  ): string => {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }, []);

  // Memoized results
  const result = useMemo(() => {
    const variables = extractVariables(template.message);
    const missingVars = findMissingVariables(template.message, sampleData);
    const processedMessage = processMessage(template.message, sampleData);
    const sanitizedMessage = DOMPurify.sanitize(processedMessage);
    
    const errors: string[] = [];
    if (missingVars.length > 0) {
      errors.push(`Missing required variables: ${missingVars.join(', ')}`);
    }

    // Check message length limits based on type
    const maxLength = template.type === 'sms' ? 160 : 1000;
    if (processedMessage.length > maxLength) {
      errors.push(`Message exceeds maximum length of ${maxLength} characters`);
    }

    return {
      processedMessage,
      charCount: processedMessage.length,
      variables,
      hasErrors: errors.length > 0,
      errors,
      sanitizedMessage
    };
  }, [template, sampleData, extractVariables, findMissingVariables, processMessage]);

  return result;
};
