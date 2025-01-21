import type { BookingStatus } from '@shared/types/booking';
import type { PaymentStatus } from '@shared/types/payment';

interface ServiceData {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  usualPrice?: number;
  appointmentTypeId: string;
  isPremium?: boolean;
}

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

/**
 * Validates service data
 */
export const isValidServiceData = (data: unknown): data is ServiceData => {
  if (!data || typeof data !== 'object') return false;

  const service = data as ServiceData;
  return (
    typeof service.id === 'string' &&
    typeof service.title === 'string' &&
    typeof service.price === 'number' &&
    typeof service.duration === 'string' &&
    typeof service.description === 'string' &&
    typeof service.appointmentTypeId === 'string' &&
    (service.usualPrice === undefined || typeof service.usualPrice === 'number') &&
    (service.isPremium === undefined || typeof service.isPremium === 'boolean')
  );
};

/**
 * Validates booking status
 */
export const isValidBookingStatus = (status: unknown): status is BookingStatus => {
  return (
    typeof status === 'string' &&
    ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)
  );
};

/**
 * Validates payment status
 */
export const isValidPaymentStatus = (status: unknown): status is PaymentStatus => {
  return (
    typeof status === 'string' &&
    ['pending', 'completed', 'expired', 'failed'].includes(status)
  );
};

/**
 * Validates postal code format
 */
export const isValidPostalCode = (code: string): ValidationResult => {
  const postalCodeRegex = /^\d{6}$/;
  return {
    isValid: postalCodeRegex.test(code),
    message: postalCodeRegex.test(code) ? undefined : 'Invalid postal code format'
  };
};

/**
 * Validates mobile number format
 */
export const isValidMobileNumber = (number: string): ValidationResult => {
  const mobileRegex = /^(\+65|65)?[689]\d{7}$/;
  return {
    isValid: mobileRegex.test(number),
    message: mobileRegex.test(number) ? undefined : 'Invalid mobile number format'
  };
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? undefined : 'Invalid email format'
  };
};

/**
 * Validates amount
 */
export const isValidAmount = (amount: number): ValidationResult => {
  return {
    isValid: amount >= 0 && Number.isFinite(amount),
    message: amount >= 0 && Number.isFinite(amount) ? undefined : 'Invalid amount'
  };
};
