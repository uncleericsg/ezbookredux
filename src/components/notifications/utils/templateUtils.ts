import { z } from 'zod';
import { MessageSquare, Mail, Bell } from 'lucide-react';
import { 
  Template, 
  templateSchema as baseTemplateSchema,
  TemplateVersion,
  ValidationResult 
} from '../types/templateTypes';
import { EnhancedTemplate } from '../adapters/types';

export { Template, TemplateVersion, ValidationResult };

export const templateSchema = baseTemplateSchema.extend({
  type: z.enum(['sms', 'email', 'push']),
  category: z.enum(['marketing', 'transactional', 'reminder']),
  description: z.string().max(200).optional(),
  updatedAt: z.string()
});

export const validateTemplate = (template: Partial<Template>): ValidationResult => {
  try {
    templateSchema.parse(template);
    return { valid: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: 'VALIDATION_ERROR'
        }))
      };
    }
    return { 
      valid: false, 
      errors: [{ 
        field: 'unknown', 
        message: 'Unknown validation error',
        code: 'UNKNOWN_ERROR'
      }] 
    };
  }
};

export const extractVariables = (content: string): string[] => {
  const variableRegex = /{{([a-zA-Z0-9_]+)}}/g;
  const matches = content.matchAll(variableRegex);
  return Array.from(matches, m => m[1]);
};

export const previewTemplate = (
  template: Template,
  variables: Record<string, string>,
  userType: Template['userType'] = 'all'
): string => {
  if (template.userType !== 'all' && template.userType !== userType) {
    throw new Error('Template not available for this user type');
  }

  let preview = template.content;
  for (const [key, value] of Object.entries(variables)) {
    preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return preview;
};

export const createAutosave = async (
  template: Partial<Template>,
  userId: string
): Promise<void> => {
  try {
    const key = `template_autosave_${userId}`;
    const autosave = {
      template,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(autosave));
  } catch (error) {
    console.error('Autosave failed:', error);
  }
};

export const createVersion = (
  template: Template,
  userId: string
): TemplateVersion => {
  return {
    version: (parseInt(template.version) + 1).toString(),
    content: template.content,
    modifiedBy: userId,
    modifiedAt: new Date().toISOString()
  };
};

export const diffTemplates = (oldContent: string, newContent: string): string[] => {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const changes: string[] = [];

  let i = 0;
  let j = 0;

  while (i < oldLines.length || j < newLines.length) {
    if (i >= oldLines.length) {
      changes.push(`+ ${newLines[j]}`);
      j++;
    } else if (j >= newLines.length) {
      changes.push(`- ${oldLines[i]}`);
      i++;
    } else if (oldLines[i] !== newLines[j]) {
      changes.push(`- ${oldLines[i]}`);
      changes.push(`+ ${newLines[j]}`);
      i++;
      j++;
    } else {
      i++;
      j++;
    }
  }

  return changes;
};

export const getTemplateIcon = (type: Template['type']) => {
  switch (type) {
    case 'email':
      return Mail;
    case 'push':
      return Bell;
    default:
      return MessageSquare;
  }
};

export const sortTemplates = (templates: Template[], sortBy: string) => {
  return [...templates].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.name.localeCompare(b.name);
      case 'type':
        return (a.type || '').localeCompare(b.type || '');
      case 'status':
        return (a.isActive ? 'active' : 'inactive').localeCompare(b.isActive ? 'active' : 'inactive');
      case 'date':
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });
};

export const filterTemplates = (templates: Template[], searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(term) ||
    template.content.toLowerCase().includes(term)
  );
};
