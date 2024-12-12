import { z } from 'zod';
import { DateTime } from 'luxon';

// Constants for business rules
export const BUSINESS_RULES = {
  maxMessagesPerDay: 1000,
  maxRecurringMessages: 100,
  businessHours: {
    start: 9, // 9 AM
    end: 18, // 6 PM
  },
  businessDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  messageLength: {
    min: 1,
    max: 150,
  },
  variables: {
    pattern: /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
    available: [
      'first_name',
      'last_name',
      'last_service_date',
      'next_service_date',
      'service_type',
      'technician_name',
      'appointment_time',
      'customer_address',
      'contact_number'
    ],
  },
  frequencies: ['once', 'daily', 'weekly', 'monthly'] as const,
  userTypes: ['all', 'amc', 'regular'] as const,
};

export type Frequency = typeof BUSINESS_RULES.frequencies[number];
export type UserType = typeof BUSINESS_RULES.userTypes[number];

// Enhanced message schema with business rules
export const messageSchema = z.object({
  content: z.string()
    .min(BUSINESS_RULES.messageLength.min, 'Message cannot be empty')
    .max(BUSINESS_RULES.messageLength.max, `Message must be ${BUSINESS_RULES.messageLength.max} characters or less`)
    .refine((content) => {
      const variables = content.match(BUSINESS_RULES.variables.pattern) || [];
      return variables.every(variable => 
        BUSINESS_RULES.variables.available.includes(
          variable.slice(1, -1) // Remove { and }
        )
      );
    }, 'Message contains invalid variables'),
  url: z.string().url('Please enter a valid URL').optional(),
  scheduledDate: z.string()
    .min(1, 'Date is required')
    .refine((date) => {
      const scheduledDate = DateTime.fromISO(date);
      return scheduledDate >= DateTime.now().startOf('day');
    }, 'Cannot schedule messages in the past'),
  scheduledTime: z.string()
    .min(1, 'Time is required')
    .refine((time) => {
      const [hours] = time.split(':').map(Number);
      return hours >= BUSINESS_RULES.businessHours.start && 
             hours < BUSINESS_RULES.businessHours.end;
    }, 'Messages can only be scheduled during business hours (9 AM - 6 PM)'),
  frequency: z.enum(BUSINESS_RULES.frequencies),
  userType: z.enum(BUSINESS_RULES.userTypes),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  timezone: z.string().default('Asia/Singapore'),
});

export type MessageFormData = z.infer<typeof messageSchema>;

export function validateSchedulingTime(date: string, time: string): boolean {
  const dateTime = DateTime.fromISO(`${date}T${time}`);
  
  // Check if it's a business day
  if (!BUSINESS_RULES.businessDays.includes(dateTime.weekday)) {
    return false;
  }

  // Check if it's during business hours
  const hour = dateTime.hour;
  return hour >= BUSINESS_RULES.businessHours.start && 
         hour < BUSINESS_RULES.businessHours.end;
}

export function validateMessageVariables(content: string): {
  isValid: boolean;
  invalidVariables: string[];
  unusedVariables: string[];
} {
  const variables = content.match(BUSINESS_RULES.variables.pattern) || [];
  const uniqueVariables = [...new Set(variables)];
  
  const invalidVariables = uniqueVariables
    .map(v => v.slice(1, -1))
    .filter(v => !BUSINESS_RULES.variables.available.includes(v));

  const unusedVariables = BUSINESS_RULES.variables.available
    .filter(v => !uniqueVariables.includes(`{${v}}`));

  return {
    isValid: invalidVariables.length === 0,
    invalidVariables,
    unusedVariables,
  };
}

export function validateRecurringMessageLimit(
  frequency: Frequency,
  existingMessages: number
): boolean {
  if (frequency === 'once') return true;
  return existingMessages < BUSINESS_RULES.maxRecurringMessages;
}

export function validateDailyMessageLimit(
  scheduledDate: string,
  existingMessages: number
): boolean {
  return existingMessages < BUSINESS_RULES.maxMessagesPerDay;
}
