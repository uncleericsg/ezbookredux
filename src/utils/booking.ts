import type { BookingValidation, TimeSlot } from '@/types/booking';

export function validateBookingTime(timeSlot: TimeSlot | null): BookingValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if time slot exists
  if (!timeSlot) {
    errors.push('Invalid time slot - missing date or time');
    return { isValid: false, errors, warnings };
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(timeSlot.startTime.split('T')[0])) {
    errors.push('Invalid date format');
  }

  // Validate time format
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(timeSlot.startTime.split('T')[1].slice(0, 5))) {
    errors.push('Invalid time format');
  }

  // Check for peak hour pricing
  if (timeSlot.isPeakHour) {
    warnings.push('Peak hour pricing applies to this time slot');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}