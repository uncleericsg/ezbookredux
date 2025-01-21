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
 * Validates postal code format (6 digits)
 */
export const isValidPostalCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

/**
 * Validates mobile number format (8 digits)
 */
export const isValidMobileNumber = (number: string): boolean => {
  return /^\d{8}$/.test(number);
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates amount (non-negative number)
 */
export const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && amount >= 0;
};
