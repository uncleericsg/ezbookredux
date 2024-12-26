import { addDays, isBefore, startOfDay } from 'date-fns';
import type { BookingValidation, TimeSlot } from '@types';
import { validateBookingTime } from '@utils/validation';
import { toast } from 'sonner';

export const validateTimeSlot = (
  slot: TimeSlot,
  isAMC = false,
  options = { showToasts: true }
): BookingValidation => {
  if (!slot) {
    return {
      isValid: false,
      errors: ['Invalid time slot'],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!slot.available) {
    errors.push('This time slot is no longer available');
    return { isValid: false, errors };
  }

  const timeValidation = validateBookingTime(slot.datetime, isAMC);
  if (!timeValidation.isValid) {
    return timeValidation;
  }

  if (timeValidation.warnings) {
    warnings.push(...timeValidation.warnings);
    if (options.showToasts) {
      warnings.forEach(warning => toast.warning(warning));
    }
  }

  const slotTime = new Date(slot.datetime);
  if (slotTime.getMinutes() % 30 !== 0) {
    errors.push('Invalid time slot. Appointments must be on the hour or half hour');
  }

  // Check for peak hours
  const hour = slotTime.getHours();
  if (hour >= 11 && hour <= 14) {
    warnings.push('This is a peak hour time slot and may have higher demand');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

export const validateBookingDetails = (
  userId: string | undefined,
  datetime: string,
  categoryId: string,
  isAMC = false,
  options = { 
    allowSameDay: false,
    showToasts: true,
    existingBookings: 0
  }
): BookingValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!userId) {
    errors.push('You must be logged in to book appointments');
    return { isValid: false, errors };
  }

  if (!datetime) {
    errors.push('Please select an appointment time');
    return { isValid: false, errors };
  }

  if (!categoryId) {
    errors.push('Invalid service category');
    return { isValid: false, errors };
  }

  const timeValidation = validateBookingTime(datetime, isAMC);
  if (!timeValidation.isValid) {
    return timeValidation;
  }

  if (timeValidation.warnings) {
    warnings.push(...timeValidation.warnings);
    if (options.showToasts) {
      warnings.forEach(warning => toast.warning(warning));
    }
  }

  const appointmentTime = new Date(datetime);
  const today = startOfDay(new Date());

  if (!options.allowSameDay && isBefore(appointmentTime, addDays(today, 1))) {
    errors.push('Same-day bookings are not allowed');
  }

  if (isAMC) {
    warnings.push('This service will count as one AMC visit');
    
    // Additional AMC validations
    const hour = appointmentTime.getHours();
    if (hour < 10 || hour > 15) {
      warnings.push('AMC services are best scheduled between 9.30 AM and 4 PM');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};