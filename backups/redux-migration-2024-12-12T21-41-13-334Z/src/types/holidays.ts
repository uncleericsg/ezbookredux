import { z } from 'zod';

export const HolidaySchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string(),
  dayOfWeek: z.string(),
  type: z.enum(['public', 'religious', 'cultural']),
  locale: z.string().default('en'),
});

export const GreetingTemplateSchema = z.object({
  id: z.string(),
  holidayId: z.string(),
  message: z.string(),
  locale: z.string(),
  variables: z.array(z.string()),
  enabled: z.boolean(),
  sendTime: z.string(),
});

export type Holiday = z.infer<typeof HolidaySchema>;
export type GreetingTemplate = z.infer<typeof GreetingTemplateSchema>;

export interface HolidayNotification {
  id: string;
  holidayId: string;
  userId: string;
  scheduledTime: string;
  sent: boolean;
  error?: string;
}