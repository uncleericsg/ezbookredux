import { addDays, isBefore, isAfter, startOfDay, isWeekend, addMinutes } from 'date-fns';
import type { BookingValidation } from '../types';

// Business rules
const MIN_BOOKING_HOURS = 24;
const MAX_BOOKING_DAYS = 104;
const BUFFER_MINUTES = 30;
const BUSINESS_START_HOUR = 9.5;  // 9:30 AM
const BUSINESS_END_HOUR = 17;
const MAX_SLOTS_PER_DAY = 6;
const AMC_MIN_INTERVAL_DAYS = 70;
const MAX_CONCURRENT_BOOKINGS = 3;
const PEAK_HOURS_START = 14;  // 2:00 PM
const PEAK_HOURS_END = 17;    // 5:00 PM

interface TimeSlotConstraints {
  minBookingHours?: number;
  maxBookingDays?: number;
  bufferMinutes?: number;
  allowWeekends?: boolean;
  allowHolidays?: boolean;
  startHour?: number;
  endHour?: number;
}

export const validateBookingTime = (
  datetime: string, 
  isAMC = false,
  constraints: TimeSlotConstraints = {}
): BookingValidation => {
  const appointmentTime = new Date(datetime);
  const now = new Date();
  const {
    minBookingHours = MIN_BOOKING_HOURS,
    maxBookingDays = MAX_BOOKING_DAYS,
    bufferMinutes = BUFFER_MINUTES,
    allowWeekends = false,
    startHour = BUSINESS_START_HOUR,
    endHour = BUSINESS_END_HOUR
  } = constraints;

  const minTime = addMinutes(now, minBookingHours * 60);
  const maxTime = addDays(startOfDay(now), maxBooking_DAYS);
  const errors: string[] = [];
  const warnings: string[] = [];

  const isFriday = appointmentTime.getDay() === 5;
  const adjustedEndHour = isFriday ? 16 : endHour;
  const maxSlots = isAMC ? 4 : MAX_SLOTS_PER_DAY;

  // Core time validation
  if (isBefore(appointmentTime, minTime)) {
    errors.push(`Appointments must be booked at least ${minBookingHours} hours in advance`);
  }

  if (isAfter(appointmentTime, maxTime)) {
    errors.push(`Appointments can only be booked up to ${maxBookingDays} days in advance`);
  }

  // Weekend validation
  if (!allowWeekends && isWeekend(appointmentTime)) {
    errors.push('Services are not available on weekends');
  }

  // Business hours validation
  const hour = appointmentTime.getHours() + (appointmentTime.getMinutes() / 60);
  if (hour < startHour || hour >= adjustedEndHour) {
    errors.push(`Service hours are ${formatHour(startHour)} to ${formatHour(adjustedEndHour)}${isFriday ? ' on Fridays' : ''}`);
  }

  // Peak hours warning
  if (hour >= PEAK_HOURS_START && hour <= PEAK_HOURS_END) {
    warnings.push('This is during peak hours (2 PM - 5 PM). Service may experience delays.');
  }

  // AMC-specific validations
  if (isAMC) {
    if (hour < 10 || hour > 15) {
      warnings.push('AMC services are best scheduled between 10 AM and 3 PM for optimal service.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

// Helper function to format hour
const formatHour = (hour: number): string => {
  const wholeHour = Math.floor(hour);
  const minutes = Math.round((hour - wholeHour) * 60);
  const period = wholeHour >= 12 ? 'PM' : 'AM';
  const displayHour = wholeHour > 12 ? wholeHour - 12 : wholeHour;
  return minutes === 0 
    ? `${displayHour}:00 ${period}`
    : `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const validateBookingDetails = (
  userId: string | undefined,
  datetime: string,
  categoryId: string,
  isAMC = false,
  existingBookings: number = 0
): BookingValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!userId) {
    errors.push('You must be logged in to book appointments');
  }

  if (!datetime) {
    errors.push('Please select an appointment time');
  }

  if (!categoryId) {
    errors.push('Invalid service category');
  }

  // Check concurrent bookings limit
  if (existingBookings >= MAX_CONCURRENT_BOOKINGS) {
    errors.push(`Maximum of ${MAX_CONCURRENT_BOOKINGS} pending appointments allowed`);
  }

  const timeValidation = datetime ? validateBookingTime(
    datetime,
    isAMC,
    isAMC ? { minBookingHours: 48, startHour: 10, endHour: 15 } : undefined
  ) : { isValid: false, errors: [] };

  errors.push(...timeValidation.errors);
  
  if (timeValidation.warnings) {
    warnings.push(...timeValidation.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

export const validateServiceCategory = (
  categoryId: string,
  isAMC: boolean,
  userAmcStatus?: string
): BookingValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!categoryId) {
    errors.push('Invalid service category');
  }

  if (isAMC && userAmcStatus !== 'active') {
    errors.push('Your AMC package is not active');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

// Export types
export type { TimeSlotConstraints };

// Export validation function
export const validateCustomerData = (data: any): boolean => {
  // Basic validation
  if (!data) return false;
  
  const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'floorUnit', 'blockStreet', 'postalCode'];
  return requiredFields.every(field => {
    const value = data[field];
    return value && typeof value === 'string' && value.trim().length > 0;
  });
};

/**
 * Validates if a string is a valid UUID
 * @param uuid String to validate
 * @returns boolean indicating if string is valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validates service data structure
 * @param service Service object to validate
 * @returns boolean indicating if service data is valid
 */
export const isValidServiceData = (service: any): boolean => {
  if (!service) return false;
  
  // Frontend sends id which maps to appointment_type_id
  return (
    typeof service.id === 'string' &&
    typeof service.title === 'string' &&
    typeof service.price === 'number' &&
    typeof service.duration === 'string'
  );
};