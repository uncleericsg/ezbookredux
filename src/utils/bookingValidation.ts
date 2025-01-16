import type { TimeSlot } from '../types/booking';

export const warnings = {
  schedule: {
    unavailable: 'This time slot is not available for booking.',
    peakHour: 'This is a peak hour slot with higher pricing.',
  },
  price: {
    multiplier: 'Peak hour pricing applies to this time slot.',
  },
};

export function validateTimeSlot(slot: TimeSlot): { isValid: boolean; warning?: string } {
  if (!slot.is_available) {
    return {
      isValid: false,
      warning: warnings.schedule.unavailable,
    };
  }

  if (slot.is_peak_hour) {
    return {
      isValid: true,
      warning: warnings.schedule.peakHour,
    };
  }

  return { isValid: true };
}

export function validatePricing(slot: TimeSlot): { warning?: string } {
  if (slot.price_multiplier > 1) {
    return {
      warning: warnings.price.multiplier,
    };
  }

  return {};
}