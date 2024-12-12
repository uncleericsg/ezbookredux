import { z } from 'zod';

export const greetingMessageSchema = z.object({
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message cannot exceed 500 characters'),
  scheduledDate: z.date(),
  templateId: z.string().optional(),
});

export type GreetingMessage = z.infer<typeof greetingMessageSchema>;

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const generatePlaceholders = (holiday: string): string[] => {
  return [
    `Wishing you a wonderful ${holiday}!`,
    `Happy ${holiday} to you and your loved ones!`,
    `Celebrate ${holiday} with joy and happiness!`,
  ];
};

export interface GreetingTemplate {
  id: string;
  name: string;
  content: string;
  tags: string[];
}

export const defaultTemplates: GreetingTemplate[] = [
  {
    id: 'template1',
    name: 'Professional',
    content: 'Wishing you a wonderful {holiday}. May this day bring joy and success.',
    tags: ['professional', 'formal'],
  },
  {
    id: 'template2',
    name: 'Casual',
    content: 'Happy {holiday}! 🎉 Have a great celebration!',
    tags: ['casual', 'friendly'],
  },
  {
    id: 'template3',
    name: 'Formal',
    content: 'On behalf of our team, we extend our warmest wishes for {holiday}.',
    tags: ['formal', 'business'],
  },
];

export const validateMessage = (message: string): string[] => {
  const errors: string[] = [];
  
  if (message.length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  if (message.length > 500) {
    errors.push('Message cannot exceed 500 characters');
  }
  if (!/[A-Za-z]/.test(message)) {
    errors.push('Message must contain at least one letter');
  }
  
  return errors;
};
