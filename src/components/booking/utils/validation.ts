import type { BookingState, ValidationErrors } from '../index';
import type { CustomerFormData } from '../CustomerForm';
import type { ValidationResult, AddressComponents, PhoneNumber, PostalCode } from './types';
import { ERROR_MESSAGES, TIME_CONSTRAINTS } from './constants';
import { ADDRESS_CONSTRAINTS, PHONE_CONSTRAINTS } from './types';

/**
 * Validates string length within constraints
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  const length = value?.trim().length ?? 0;
  return length >= min && length <= max;
};

/**
 * Sanitizes input by removing unwanted characters
 */
export const sanitizeInput = (value: string | null | undefined, type: 'alphanumeric' | 'numeric' | 'alpha' = 'alphanumeric'): string => {
  if (!value) return '';
  
  switch (type) {
    case 'numeric':
      return value.replace(/[^\d]/g, '');
    case 'alpha':
      return value.replace(/[^a-zA-Z\s]/g, '');
    default:
      return value.replace(/[^a-zA-Z0-9\s]/g, '');
  }
};

/**
 * Validates a Singapore postal code
 */
export const validatePostalCode = (code: string | null | undefined): ValidationResult<PostalCode> => {
  const sanitized = sanitizeInput(code, 'numeric');
  
  if (!sanitized) {
    return {
      isValid: false,
      errors: { postalCode: ERROR_MESSAGES.ADDRESS.POSTAL_CODE.REQUIRED }
    };
  }

  const isValid = /^\d{6}$/.test(sanitized);
  return {
    isValid,
    errors: isValid ? undefined : { postalCode: ERROR_MESSAGES.ADDRESS.POSTAL_CODE.INVALID_FORMAT },
    formatted: isValid ? (sanitized as PostalCode) : undefined
  };
};

/**
 * Validates a phone number
 */
export const validatePhoneNumber = (phone: string | null | undefined): ValidationResult<PhoneNumber> => {
  if (!phone) {
    return {
      isValid: false,
      errors: { phone: ERROR_MESSAGES.PHONE.REQUIRED }
    };
  }

  const sanitized = phone.replace(/\D/g, '');

  if (sanitized.length !== 8) {
    return {
      isValid: false,
      errors: { phone: ERROR_MESSAGES.PHONE.INVALID_LENGTH }
    };
  }

  if (!['6', '8', '9'].includes(sanitized[0])) {
    return {
      isValid: false,
      errors: { phone: ERROR_MESSAGES.PHONE.INVALID_PREFIX }
    };
  }

  return {
    isValid: true,
    formatted: sanitized as PhoneNumber
  };
};

/**
 * Validates address components
 */
export const validateAddress = (components: Partial<AddressComponents>): ValidationResult<AddressComponents> => {
  const errors: Record<string, string> = {};
  const formatted: Partial<AddressComponents> = {};

  // Validate block
  if (!components.block?.trim()) {
    errors.block = ERROR_MESSAGES.ADDRESS.BLOCK.REQUIRED;
  } else if (!isValidLength(components.block, ADDRESS_CONSTRAINTS.block.minLength, ADDRESS_CONSTRAINTS.block.maxLength)) {
    errors.block = ERROR_MESSAGES.ADDRESS.BLOCK.TOO_LONG;
  } else {
    formatted.block = components.block.trim();
  }

  // Validate street
  if (!components.street?.trim()) {
    errors.street = ERROR_MESSAGES.ADDRESS.STREET.REQUIRED;
  } else if (!isValidLength(components.street, ADDRESS_CONSTRAINTS.street.minLength, ADDRESS_CONSTRAINTS.street.maxLength)) {
    errors.street = ERROR_MESSAGES.ADDRESS.STREET.TOO_LONG;
  } else {
    formatted.street = components.street.trim();
  }

  // Validate unit number if provided
  if (components.unitNumber) {
    if (!isValidLength(components.unitNumber, ADDRESS_CONSTRAINTS.unitNumber.minLength, ADDRESS_CONSTRAINTS.unitNumber.maxLength)) {
      errors.unitNumber = ERROR_MESSAGES.ADDRESS.UNIT.TOO_LONG;
    } else {
      formatted.unitNumber = components.unitNumber.trim();
    }
  }

  // Validate postal code
  const postalResult = validatePostalCode(components.postalCode);
  if (!postalResult.isValid) {
    errors.postalCode = Object.values(postalResult.errors || {})[0];
  } else if (postalResult.formatted) {
    formatted.postalCode = postalResult.formatted;
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors: isValid ? undefined : errors,
    formatted: isValid ? (formatted as AddressComponents) : undefined
  };
};

/**
 * Validates customer form data
 */
export const validateCustomerData = (data: CustomerFormData): ValidationResult<CustomerFormData> => {
  const errors: Record<string, string> = {};
  const formatted: Partial<CustomerFormData> = {};

  // Validate name
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (!isValidLength(data.name, 2, 100)) {
    errors.name = 'Name must be between 2 and 100 characters';
  } else {
    formatted.name = data.name.trim();
  }

  // Validate email
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  } else {
    formatted.email = data.email.trim().toLowerCase();
  }

  // Validate phone
  const phoneResult = validatePhoneNumber(data.phone);
  if (!phoneResult.isValid) {
    errors.phone = Object.values(phoneResult.errors || {})[0];
  } else if (phoneResult.formatted) {
    formatted.phone = phoneResult.formatted;
  }

  // Validate address
  const addressResult = validateAddress({
    block: data.block,
    street: data.street,
    unitNumber: data.unitNumber,
    postalCode: data.postalCode as PostalCode
  });

  if (!addressResult.isValid && addressResult.errors) {
    Object.assign(errors, addressResult.errors);
  } else if (addressResult.formatted) {
    Object.assign(formatted, addressResult.formatted);
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors: isValid ? undefined : errors,
    formatted: isValid ? (formatted as CustomerFormData) : undefined
  };
};

/**
 * Validates the booking data at each step
 */
export const validateBookingStep = (
  state: BookingState,
  step: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  switch (step) {
    case 'brand':
      if (!state.selectedBrands?.length) {
        errors.brands = 'Please select at least one AC brand';
      }
      break;

    case 'issues':
      if (!state.selectedIssues?.length) {
        errors.issues = 'Please select at least one issue';
      }
      break;

    case 'details':
      if (state.customerData) {
        const result = validateCustomerData(state.customerData);
        if (!result.isValid) {
          errors.customerInfo = result.errors;
        }
      } else {
        errors.customerInfo = { form: 'Customer information is required' };
      }
      break;

    case 'schedule':
      if (!state.scheduleData?.date) {
        errors.schedule = ERROR_MESSAGES.DATE.REQUIRED;
      } else {
        const selectedDate = new Date(state.scheduleData.date);
        const now = new Date();
        
        if (selectedDate < now) {
          errors.schedule = ERROR_MESSAGES.DATE.PAST;
        }
        
        const daysDiff = Math.floor((selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > TIME_CONSTRAINTS.bookingWindow.maxDays) {
          errors.schedule = ERROR_MESSAGES.DATE.TOO_FAR;
        }
      }

      if (!state.scheduleData?.time) {
        errors.time = ERROR_MESSAGES.TIME.REQUIRED;
      } else {
        const [hours] = state.scheduleData.time.split(':').map(Number);
        if (hours < TIME_CONSTRAINTS.businessHours.start || hours >= TIME_CONSTRAINTS.businessHours.end) {
          errors.time = ERROR_MESSAGES.TIME.OUTSIDE_HOURS;
        }
      }
      break;
  }

  return errors;
};
