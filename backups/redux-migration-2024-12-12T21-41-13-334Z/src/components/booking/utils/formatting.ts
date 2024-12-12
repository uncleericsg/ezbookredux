import type { BookingState } from '../index';
import type { CustomerFormData } from '../CustomerForm';
import type { AddressFormat, FormattedAddress, PhoneNumber, PostalCode } from './types';
import { INPUT_MASKS } from './constants';
import { sanitizeInput } from './validation';

/**
 * Formats a phone number to Singapore format
 */
export const formatPhoneNumber = (phone: string | null | undefined, includeCountryCode = false): string => {
  const digits = sanitizeInput(phone, 'numeric');
  if (!digits) return '';

  // Remove country code if present
  const number = digits.startsWith('65') ? digits.slice(2) : digits;
  
  // Handle partial input
  if (number.length < 8) {
    const parts = [
      number.slice(0, 4),
      number.slice(4)
    ].filter(Boolean);
    return parts.join(' ');
  }
  
  // Format complete number
  const formatted = number.replace(/(\d{4})(\d{4})/, '$1 $2');
  return includeCountryCode ? `+65 ${formatted}` : formatted;
};

/**
 * Formats a unit number with consistent formatting
 */
export const formatUnitNumber = (unit: string | null | undefined, includeHash = true): string => {
  if (!unit) return '';
  
  // Remove existing formatting
  const cleaned = unit.replace(/[#\-\/]/g, '');
  
  // Split into level and unit
  const parts = cleaned.match(/^(\d{1,3})(\d{1,4})$/);
  if (!parts) return unit; // Return original if format doesn't match
  
  const [, level, number] = parts;
  const formatted = `${level}-${number}`;
  
  return includeHash ? `#${formatted}` : formatted;
};

/**
 * Formats an address based on the specified format
 */
export const formatAddress = (
  components: {
    block: string;
    street: string;
    unitNumber?: string;
    postalCode: PostalCode | string;
    buildingName?: string;
  },
  format: AddressFormat = 'full'
): FormattedAddress => {
  const {
    block,
    street,
    unitNumber,
    postalCode,
    buildingName
  } = components;

  // Format unit number if present
  const formattedUnit = unitNumber ? formatUnitNumber(unitNumber) : '';

  // Build address parts
  const addressParts = {
    unit: formattedUnit,
    block: block.trim(),
    street: street.trim(),
    building: buildingName?.trim(),
    postal: postalCode
  };

  // Create short format
  const shortParts = [
    addressParts.block,
    addressParts.street
  ].filter(Boolean);
  
  // Create full format
  const fullParts = [
    addressParts.unit,
    addressParts.block,
    addressParts.street,
    addressParts.building,
    `Singapore ${addressParts.postal}`
  ].filter(Boolean);

  return {
    short: shortParts.join(' '),
    full: fullParts.join(', '),
    components: {
      block: addressParts.block,
      street: addressParts.street,
      unitNumber: addressParts.unit,
      postalCode: addressParts.postal as PostalCode,
      buildingName: addressParts.building
    }
  };
};

/**
 * Formats the customer data for display
 */
export const formatCustomerData = (data: CustomerFormData | null | undefined) => {
  if (!data) return null;

  const formatted = {
    ...data,
    phone: formatPhoneNumber(data.phone, true),
    address: formatAddress({
      block: data.block,
      street: data.street,
      unitNumber: data.unitNumber,
      postalCode: data.postalCode
    })
  };

  return formatted;
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date | string | null | undefined, format: 'short' | 'long' = 'long'): string => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  
  return d.toLocaleDateString('en-SG', options);
};

/**
 * Formats a time for display
 */
export const formatTime = (time: string | null | undefined, format: '12h' | '24h' = '12h'): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Formats the full booking data for submission
 */
export const formatBookingData = (state: BookingState | null | undefined) => {
  if (!state) return null;

  const { customerData, selectedBrands, selectedIssues, scheduleData } = state;

  return {
    customer: customerData ? formatCustomerData(customerData) : undefined,
    service: {
      brands: selectedBrands || [],
      issues: selectedIssues || [],
    },
    schedule: scheduleData ? {
      date: scheduleData.date ? new Date(scheduleData.date).toISOString() : undefined,
      time: scheduleData.time ? formatTime(scheduleData.time, '24h') : undefined,
      displayDate: scheduleData.date ? formatDate(scheduleData.date) : undefined,
      displayTime: scheduleData.time ? formatTime(scheduleData.time, '12h') : undefined,
    } : undefined,
  };
};
