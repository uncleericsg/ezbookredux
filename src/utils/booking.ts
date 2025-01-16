import type { TimeSlot, BookingValidation } from '@/types/booking';
import { validateBookingTime } from '@/utils/validation';

export function validateBookingSlot(
  slot: TimeSlot | null,
  options: {
    minHoursBefore?: number;
    maxDaysAhead?: number;
  } = {}
): BookingValidation {
  if (!slot) {
    return {
      isValid: false,
      errors: {
        schedule: ['Time slot is required']
      }
    };
  }

  const timeValidation = validateBookingTime(slot);
  if (!timeValidation.isValid) {
    return timeValidation;
  }

  if (!slot.is_available) {
    return {
      isValid: false,
      errors: {
        schedule: ['Selected time slot is not available']
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