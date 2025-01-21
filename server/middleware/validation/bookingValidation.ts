import type { ValidationSchema } from '@shared/types/validation';
import { validate as validateSchema } from '../validation';

/**
 * Booking creation schema
 */
export const createBookingSchema: ValidationSchema = {
  serviceId: {
    type: 'string',
    required: true,
    message: 'Service ID is required'
  },
  customerId: {
    type: 'string',
    required: true,
    message: 'Customer ID is required'
  },
  date: {
    type: 'date',
    required: true,
    validate: (value) => {
      const date = new Date(value as string);
      return date > new Date();
    },
    message: 'Booking date must be in the future'
  },
  time: {
    type: 'string',
    required: true,
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    message: 'Time must be in HH:MM format'
  },
  duration: {
    type: 'number',
    required: true,
    min: 30,
    max: 480,
    message: 'Duration must be between 30 and 480 minutes'
  },
  notes: {
    type: 'string',
    required: false,
    max: 1000,
    message: 'Notes cannot exceed 1000 characters'
  },
  location: {
    type: 'object',
    required: true,
    message: 'Location is required',
    validate: (value) => {
      if (!value || typeof value !== 'object') return false;
      const location = value as Record<string, unknown>;
      return (
        typeof location.address === 'string' &&
        typeof location.postalCode === 'string' &&
        /^\d{6}$/.test(location.postalCode) &&
        (!location.coordinates || (
          typeof location.coordinates === 'object' &&
          typeof (location.coordinates as any).lat === 'number' &&
          typeof (location.coordinates as any).lng === 'number'
        ))
      );
    }
  }
};

/**
 * Booking update schema
 */
export const updateBookingSchema: ValidationSchema = {
  date: {
    type: 'date',
    required: false,
    validate: (value) => {
      if (!value) return true;
      const date = new Date(value as string);
      return date > new Date();
    },
    message: 'Booking date must be in the future'
  },
  time: {
    type: 'string',
    required: false,
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    message: 'Time must be in HH:MM format'
  },
  duration: {
    type: 'number',
    required: false,
    min: 30,
    max: 480,
    message: 'Duration must be between 30 and 480 minutes'
  },
  notes: {
    type: 'string',
    required: false,
    max: 1000,
    message: 'Notes cannot exceed 1000 characters'
  },
  status: {
    type: 'string',
    required: false,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    message: 'Invalid booking status'
  }
};

/**
 * Booking search schema
 */
export const searchBookingsSchema: ValidationSchema = {
  customerId: {
    type: 'string',
    required: false
  },
  serviceId: {
    type: 'string',
    required: false
  },
  status: {
    type: 'string',
    required: false,
    enum: ['pending', 'confirmed', 'cancelled', 'completed']
  },
  startDate: {
    type: 'date',
    required: false
  },
  endDate: {
    type: 'date',
    required: false
  },
  page: {
    type: 'number',
    required: false,
    min: 1,
    transform: (value) => Number(value) || 1
  },
  limit: {
    type: 'number',
    required: false,
    min: 1,
    max: 100,
    transform: (value) => Math.min(Math.max(Number(value) || 20, 1), 100)
  },
  sort: {
    type: 'string',
    required: false,
    enum: ['date', '-date', 'status', '-status'],
    transform: (value) => String(value || '-date')
  }
};

/**
 * Booking ID schema
 */
export const bookingIdSchema: ValidationSchema = {
  id: {
    type: 'string',
    required: true,
    message: 'Booking ID is required'
  }
};

/**
 * Email schema
 */
export const emailSchema: ValidationSchema = {
  email: {
    type: 'string',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  }
};

/**
 * Customer ID schema
 */
export const customerIdSchema: ValidationSchema = {
  customerId: {
    type: 'string',
    required: true,
    message: 'Customer ID is required'
  }
};

/**
 * Validation functions
 */
export const validate = {
  createBookingSchema,
  updateBookingSchema,
  searchBookingsSchema,
  bookingIdSchema,
  emailSchema,
  customerIdSchema,
  createBooking: validateSchema(createBookingSchema),
  updateBooking: validateSchema(updateBookingSchema),
  searchBookings: validateSchema(searchBookingsSchema, { stripUnknown: true }),
  bookingId: validateSchema(bookingIdSchema),
  email: validateSchema(emailSchema),
  customerId: validateSchema(customerIdSchema)
};
