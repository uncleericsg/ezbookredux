import DOMPurify from 'dompurify';
import { Template } from '../types/templateTypes';
import { PreviewConfig, PreviewData, ProcessedMessage } from '../types/messageTypes';
import { MESSAGE_LIMITS, TEMPLATE_TYPES } from '../constants/templateConstants';

export class PreviewAdapter {
  createPreviewConfig(
    template: Template,
    mode: 'desktop' | 'mobile' = 'desktop',
    sampleData: PreviewData = {}
  ): PreviewConfig {
    return {
      mode,
      sampleData,
      characterLimit: MESSAGE_LIMITS[template.type as keyof typeof TEMPLATE_TYPES] || 1000
    };
  }

  processMessage(content: string, config: PreviewConfig): string {
    let processedContent = content;

    // Replace variables with sample data
    Object.entries(config.sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });

    // Replace any remaining variables with placeholders
    processedContent = processedContent.replace(/{{(\w+)}}/g, (_, key) => `[${key}]`);

    // Sanitize HTML if present
    if (/<[^>]*>/g.test(processedContent)) {
      processedContent = DOMPurify.sanitize(processedContent);
    }

    return processedContent;
  }

  getCharacterCount(content: string): number {
    // Remove HTML tags if present
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length;
  }

  validateMessage(content: string, config: PreviewConfig): string[] {
    const errors: string[] = [];
    const characterCount = this.getCharacterCount(content);

    // Check character limit
    if (characterCount > config.characterLimit) {
      errors.push(`Message exceeds character limit (${characterCount}/${config.characterLimit})`);
    }

    // Check for unclosed HTML tags
    if (/<[^>]*$/g.test(content)) {
      errors.push('Message contains unclosed HTML tags');
    }

    // Check for remaining unprocessed variables
    const remainingVars = content.match(/{{(\w+)}}/g);
    if (remainingVars) {
      errors.push(`Message contains unprocessed variables: ${remainingVars.join(', ')}`);
    }

    return errors;
  }
}
