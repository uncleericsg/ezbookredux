import type { TimeSlot, BookingValidation } from '@/types/booking';

export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function validateBookingTime(slot: TimeSlot | null): BookingValidation {
  if (!slot) {
    return {
      isValid: false,
      errors: {
        schedule: ['Time slot is required']
      }
    };
  }

  if (!slot.datetime) {
    return {
      isValid: false,
      errors: {
        schedule: ['Invalid time slot format']
      }
    };
  }

  if (!isValidDate(slot.datetime.split('T')[0])) {
    return {
      isValid: false,
      errors: {
        schedule: ['Invalid date format']
      }
    };
  }

  if (!isValidTime(slot.datetime.split('T')[1].split('.')[0])) {
    return {
      isValid: false,
      errors: {
        schedule: ['Invalid time format']
      }
    };
  }

  const errors: { schedule?: string[] } = {};
  const warnings: { schedule?: string[]; price?: string[] } = {};

  if (slot.price_multiplier > 1) {
    warnings.price = ['This is a peak hour slot with higher pricing'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined
  };
}