export interface PushTemplate {
  id: string;
  title: string;
  content: string;
  url?: string;
  triggerType: 'manual' | 'scheduled' | 'event';
  dueDays?: number;
  status: 'active' | 'inactive';
  lastModified: string;
  order: number;
  media?: {
    image?: string;
    video?: string;
  };
  targeting?: {
    userGroups: string[];
    regions: string[];
    languages: string[];
  };
  abTest?: {
    enabled: boolean;
    variants: Array<{
      id: string;
      content: string;
      weight: number;
    }>;
  };
  analytics?: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
  schedule?: {
    startDate?: string;
    endDate?: string;
    timezone: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
}

export interface TemplateVariable {
  key: string;
  value: string;
  required: boolean;
  description?: string;
}

export type PreviewMode = 'mobile' | 'desktop';

export interface Template extends PushTemplate {
  message: string;
  type: 'email' | 'push' | 'sms';
  variables: TemplateVariable[];
}

export interface TemplatePreviewProps {
  template: Template;
  sampleData?: Record<string, string>;
  previewMode?: PreviewMode;
  onCopy?: () => void;
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export interface TemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export interface ProcessedTemplate {
  processedMessage: string;
  charCount: number;
  variables: TemplateVariable[];
  hasErrors: boolean;
  errors: string[];
  sanitizedMessage: string;
} 