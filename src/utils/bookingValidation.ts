import { addDays, isBefore, isAfter, startOfDay, addMinutes } from 'date-fns';
import type { BookingValidation, TimeSlot, AppointmentType } from '../types';
import { toast } from 'sonner';
import { BUSINESS_RULES } from '../constants/businessRules';

export const validateBookingDetails = (
  userId: string | undefined,
  datetime: string | undefined,
  categoryId: string | undefined,
  isAMC = false
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

  const timeValidation = validateTimeSlot({ 
    id: '0',
    datetime,
    available: true 
  }, isAMC);

  if (!timeValidation.isValid) {
    return timeValidation;
  }

  if (timeValidation.warnings) {
    warnings.push(...timeValidation.warnings);
  }

  return {
    isValid: true,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

export const validateTimeSlot = (
  slot: TimeSlot,
  isAMC = false,
  existingBookings: { datetime: string; duration: number; type: string }[] = [],
  appointmentType?: AppointmentType
): BookingValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slotTime = new Date(slot.datetime);
  const now = new Date();
  const isFriday = slotTime.getDay() === 5;
  const hour = slotTime.getHours();
  const minutes = slotTime.getMinutes();
  const timeValue = hour + (minutes / 60);
  const duration = appointmentType?.duration || 
    (isAMC ? BUSINESS_RULES.SLOT_DURATION.AMC : BUSINESS_RULES.SLOT_DURATION.REGULAR);

  // Validate business hours
  // Check business hours
  if (timeValue < 9.5) { // 9:30 AM
    errors.push('Service hours start at 9:30 AM');
    return { isValid: false, errors };
  }

  // Last booking time check
  if (isFriday && timeValue >= 16.5) { // 4:30 PM for Fridays
    errors.push('Last booking for Friday is 4:30 PM');
    return { isValid: false, errors };
  } else if (!isFriday && timeValue >= 17) { // 5:00 PM for other days
    errors.push('Last booking time is 5:00 PM');
    return { isValid: false, errors };
  }

  // Validate slot allocation
  const amcBookings = existingBookings.filter(b => b.type === 'amc').length;
  const regularBookings = existingBookings.filter(b => b.type !== 'amc').length;
  const totalBookings = amcBookings + regularBookings;

  // Check AMC slot limits
  if (isAMC && amcBookings >= 3) { // Max 3 AMC slots per day
    errors.push('Maximum AMC slots for the day reached');
    return { isValid: false, errors };
  }

  // Check regular booking limits
  if (!isAMC && regularBookings >= 4) { // Min 4 slots for regular bookings
    errors.push('Maximum regular slots for the day reached');
    return { isValid: false, errors };
  }

  // Check total slot limit
  if (totalBookings >= 6) { // Max 6 total slots per day
    errors.push('No more slots available for this day');
    return { isValid: false, errors };
  }

  const slotEnd = addMinutes(slotTime, duration);

  // Check for overlapping appointments
  const hasOverlap = existingBookings.some(booking => {
    const bookingStart = new Date(booking.datetime);
    const bookingEnd = addMinutes(bookingStart, booking.duration);
    const buffer = BUSINESS_RULES.BUFFER_TIME;
    const bufferedStart = addMinutes(bookingStart, -buffer);
    const bufferedEnd = addMinutes(bookingEnd, buffer);
    return (
      (slotTime >= bufferedStart && slotTime < bufferedEnd) ||
      (slotEnd > bufferedStart && slotEnd <= bufferedEnd)
    );
  });

  if (hasOverlap) {
    errors.push('This time slot conflicts with an existing booking');
    return { isValid: false, errors };
  }

  if (!slot.available) {
    errors.push('This time slot is no longer available');
    return { isValid: false, errors };
  }

  const minTime = addMinutes(now, BUSINESS_RULES.MIN_BOOKING_HOURS * 60);
  const maxTime = addDays(startOfDay(now), BUSINESS_RULES.MAX_BOOKING_DAYS);

  // Basic time validation
  if (isBefore(slotTime, minTime)) {
    errors.push(`Appointments must be booked at least ${BUSINESS_RULES.MIN_BOOKING_HOURS} hours in advance`);
    return { isValid: false, errors };
  }

  if (isAfter(slotTime, maxTime)) {
    errors.push(`Appointments can only be booked up to ${BUSINESS_RULES.MAX_BOOKING_DAYS} days in advance`);
    return { isValid: false, errors };
  }

  // Peak hours warning
  if (hour >= BUSINESS_RULES.PEAK_HOURS.START && hour <= BUSINESS_RULES.PEAK_HOURS.END) {
    warnings.push(BUSINESS_RULES.PEAK_HOURS.WARNING);
  }

  // AMC recommendations
  if (isAMC && timeValue >= BUSINESS_RULES.RECOMMENDED_HOURS.AMC.START && 
      timeValue <= BUSINESS_RULES.RECOMMENDED_HOURS.AMC.END) {
    warnings.push(BUSINESS_RULES.RECOMMENDED_HOURS.AMC.MESSAGE);
  }

  return {
    isValid: true,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

export const validateSlotAllocation = (
  isAMC: boolean,
  amcBookings: number,
  regularBookings: number,
  totalSlots: number = BUSINESS_RULES.MAX_SLOTS_PER_DAY.TOTAL
): BookingValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const remainingSlots = totalSlots - (amcBookings + regularBookings);
  const minRegularSlots = BUSINESS_RULES.MAX_SLOTS_PER_DAY.MIN_REGULAR;
  const maxAmcSlots = BUSINESS_RULES.MAX_SLOTS_PER_DAY.AMC;

  if (remainingSlots <= 0) {
    errors.push('No more slots available for this day');
    return { isValid: false, errors };
  }

  if (isAMC) {
    if (amcBookings >= maxAmcSlots) {
      errors.push('Maximum AMC slots for the day reached');
      return { isValid: false, errors };
    }

    const slotsNeededForRegular = Math.max(0, minRegularSlots - regularBookings);
    if (remainingSlots <= slotsNeededForRegular) {
      errors.push('Remaining slots reserved for regular bookings');
      return { isValid: false, errors };
    }
  } else {
    const availableRegularSlots = totalSlots - maxAmcSlots;
    if (regularBookings >= availableRegularSlots) {
      errors.push('No more slots available for regular bookings');
      return { isValid: false, errors };
    }
  }

  return {
    isValid: true,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};