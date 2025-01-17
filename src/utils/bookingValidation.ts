import type { TimeSlot } from '@/types/timeSlot';
import type { ErrorMetadata } from '@/types/error';
import { logger } from '@/lib/logger';

export const warnings = {
  schedule: {
    unavailable: 'This time slot is not available for booking.',
    peakHour: 'This is a peak hour slot with higher pricing.',
  },
  price: {
    multiplier: 'Peak hour pricing applies to this time slot.',
  },
};

export interface ValidationResult {
  isValid: boolean;
  warning?: string;
  error?: string;
}

export function validateTimeSlot(slot: TimeSlot): ValidationResult {
  try {
    if (!slot.isAvailable || slot.status !== 'available') {
      return {
        isValid: false,
        warning: warnings.schedule.unavailable,
      };
    }

    if (slot.isPeakHour) {
      return {
        isValid: true,
        warning: warnings.schedule.peakHour,
      };
    }

    return { isValid: true };
  } catch (error) {
    const metadata: ErrorMetadata = {
      message: error instanceof Error ? error.message : String(error),
      details: { slotId: slot.id }
    };
    logger.error('Error validating time slot:', metadata);
    return {
      isValid: false,
      error: 'Failed to validate time slot'
    };
  }
}

export function validatePricing(slot: TimeSlot): ValidationResult {
  try {
    if (slot.priceMultiplier > 1) {
      return {
        isValid: true,
        warning: warnings.price.multiplier,
      };
    }

    return { isValid: true };
  } catch (error) {
    const metadata: ErrorMetadata = {
      message: error instanceof Error ? error.message : String(error),
      details: { slotId: slot.id }
    };
    logger.error('Error validating pricing:', metadata);
    return {
      isValid: false,
      error: 'Failed to validate pricing'
    };
  }
}

export function validateBookingTime(slot: TimeSlot): ValidationResult {
  try {
    const now = new Date();
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    if (slotStart < now) {
      return {
        isValid: false,
        error: 'Cannot book a time slot in the past'
      };
    }

    if (slotEnd <= slotStart) {
      return {
        isValid: false,
        error: 'Invalid time slot duration'
      };
    }

    return { isValid: true };
  } catch (error) {
    const metadata: ErrorMetadata = {
      message: error instanceof Error ? error.message : String(error),
      details: { slotId: slot.id }
    };
    logger.error('Error validating booking time:', metadata);
    return {
      isValid: false,
      error: 'Failed to validate booking time'
    };
  }
}