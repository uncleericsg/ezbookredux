import type { TimeSlot } from '@/types/timeSlot';
import type { ErrorMetadata } from '@/types/error';
import { logger } from '@/lib/logger';

export function validateTimeSlot(slot: TimeSlot): boolean {
  try {
    if (!slot.startTime || !slot.endTime) {
      logger.error('Invalid time slot:', {
        message: 'Missing required fields',
        details: { slotId: slot.id }
      } satisfies ErrorMetadata);
      return false;
    }

    const startTime = new Date(slot.startTime);
    const endTime = new Date(slot.endTime);

    if (startTime >= endTime) {
      logger.error('Invalid time slot:', {
        message: 'End time must be after start time',
        details: { slotId: slot.id }
      } satisfies ErrorMetadata);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error validating time slot:', {
      message: error instanceof Error ? error.message : String(error),
      details: { slotId: slot.id }
    } satisfies ErrorMetadata);
    return false;
  }
}