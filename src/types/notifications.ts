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

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  telegram?: boolean;
  scheduleReminders: boolean;
  serviceUpdates: boolean;
  marketingMessages: boolean;
  holidayGreetings: boolean;
}

export interface Notification {
  userId: string;
  type: 'reminder' | 'update' | 'marketing' | 'greeting' | 'alert';
  message: string;
  metadata?: {
    title?: string;
    body?: string;
    image?: string;
    link?: string;
    [key: string]: any;
  };
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  category: 'service' | 'booking' | 'marketing' | 'system';
  channels: Array<keyof NotificationPreferences>;
  isEnabled: boolean;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType['id'];
  title: string;
  body: string;
  variables: string[];
  isActive: boolean;
  metadata?: {
    previewText?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    [key: string]: any;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  categories: {
    [key in NotificationType['category']]: {
      total: number;
      unread: number;
    };
  };
}