import { z } from 'zod';
import debounce from 'lodash/debounce';
import { MessageSquare, Mail, Bell } from 'lucide-react';
import { TEMPLATE_TYPES } from '../constants/templateConstants';

export interface Template {
  id: string;
  name: string;
  content: string;
  version: number;
  lastModified: string;
  variables: string[];
  userType: 'all' | 'amc' | 'regular';
  type: string;
  status?: string;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  content: string;
  version: number;
  createdAt: string;
  createdBy: string;
}

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  content: z.string()
    .min(1, 'Template content is required')
    .max(500)
    .refine(content => {
      // Check for valid variable syntax: {{variableName}}
      const variableRegex = /{{[a-zA-Z0-9_]+}}/g;
      const matches = content.match(variableRegex) || [];
      const uniqueMatches = new Set(matches);
      return matches.length === uniqueMatches.size;
    }, 'Template contains duplicate or invalid variables'),
  userType: z.enum(['all', 'amc', 'regular']),
  type: z.string(),
  variables: z.array(z.string())
});

export const validateTemplate = (template: Partial<Template>) => {
  try {
    templateSchema.parse(template);
    return { valid: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error.errors };
    }
    return { valid: false, errors: [{ message: 'Unknown validation error' }] };
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
  userType: 'all' | 'amc' | 'regular' = 'all'
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

// Autosave functionality
export const createAutosave = (
  saveFunction: (template: Partial<Template>) => Promise<void>,
  delay = 1000
) => {
  return debounce(async (template: Partial<Template>) => {
    try {
      await saveFunction(template);
    } catch (error) {
      console.error('Autosave failed:', error);
      // Implement your error handling here
    }
  }, delay);
};

// Version control
export const createVersion = (
  template: Template,
  userId: string
): TemplateVersion => {
  return {
    id: crypto.randomUUID(),
    templateId: template.id,
    content: template.content,
    version: template.version + 1,
    createdAt: new Date().toISOString(),
    createdBy: userId,
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

// Get icon component based on template type
export const getTemplateIcon = (type: Template['type']) => {
  switch (type) {
    case TEMPLATE_TYPES.EMAIL:
      return Mail;
    case TEMPLATE_TYPES.PUSH:
      return Bell;
    default:
      return MessageSquare;
  }
};

// Sort templates by different criteria
export const sortTemplates = (templates: Template[], sortBy: string) => {
  return [...templates].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.name.localeCompare(b.name);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      case 'date':
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });
};

// Filter templates by search term
export const filterTemplates = (templates: Template[], searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(term) ||
    template.content.toLowerCase().includes(term)
  );
};
