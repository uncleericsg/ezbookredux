import Joi from 'joi';
import { ApiError } from './apiErrors';
import type { BookingDetails, CreateBookingParams, UpdateBookingParams } from '@shared/types/booking';

const bookingSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  serviceId: Joi.string().uuid().required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
  notes: Joi.string().max(500),
  customerInfo: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/)
  })
});

const updateBookingSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
  notes: Joi.string().max(500),
  customerInfo: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/)
  })
});

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().valid('sgd').required(),
  serviceId: Joi.string().uuid().required(),
  bookingId: Joi.string().uuid().required(),
  customerId: Joi.string().uuid().required(),
  tipAmount: Joi.number().min(0).optional()
});

export async function validatePaymentData(data: any) {
  try {
    const { error, value } = paymentSchema.validate(data, { abortEarly: false });

    if (error) {
      throw new ApiError(
        'Invalid payment data',
        'VALIDATION_ERROR',
        {
          details: error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
            type: detail.type
          }))
        }
      );
    }

    return value;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      'Failed to validate payment data',
      'VALIDATION_ERROR',
      { originalError: error }
    );
  }
}

export async function validateBookingData(data: CreateBookingParams | UpdateBookingParams): Promise<BookingDetails> {
  try {
    const schema = 'id' in data ? updateBookingSchema : bookingSchema;
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ApiError(
        'Invalid booking data',
        'VALIDATION_ERROR',
        {
          details: error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
            type: detail.type
          }))
        }
      );
    }

    return value;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      'Failed to validate booking data',
      'VALIDATION_ERROR',
      { originalError: error }
    );
  }
}

export function validateEmail(email: string): { error?: ApiError } {
  const { error } = Joi.string().email().validate(email);
  
  if (error) {
    return {
      error: new ApiError(
        'Invalid email format',
        'INVALID_EMAIL',
        { details: error.details }
      )
    };
  }
  return {};
}

export function validateCustomerId(id: string): void {
  const { error } = Joi.string().uuid().validate(id);
  
  if (error) {
    throw new ApiError(
      'Invalid customer ID format',
      'INVALID_CUSTOMER_ID',
      { details: error.details }
    );
  }
}

export function validateServiceId(id: string): void {
  const { error } = Joi.string().uuid().validate(id);
  
  if (error) {
    throw new ApiError(
      'Invalid service ID format',
      'INVALID_SERVICE_DATA',
      { details: error.details }
    );
  }
}

export function validateDate(date: string): void {
  const { error } = Joi.date().iso().validate(date);
  
  if (error) {
    throw new ApiError(
      'Invalid date format',
      'VALIDATION_ERROR',
      { details: error.details }
    );
  }
}

export function validatePhoneNumber(phone: string): void {
  const { error } = Joi.string()
    .pattern(/^\+?[\d\s-()]{10,}$/)
    .validate(phone);
  
  if (error) {
    throw new ApiError(
      'Invalid phone number format',
      'INVALID_MOBILE',
      { details: error.details }
    );
  }
}

export function validatePostalCode(postalCode: string): void {
  const { error } = Joi.string()
    .pattern(/^\d{6}$/)
    .validate(postalCode);
  
  if (error) {
    throw new ApiError(
      'Invalid postal code format',
      'INVALID_POSTAL_CODE',
      { details: error.details }
    );
  }
}

export function validatePaymentId(id: string): void {
  const { error } = Joi.string().uuid().validate(id);
  
  if (error) {
    throw new ApiError(
      'Invalid payment ID format',
      'VALIDATION_ERROR',
      { details: error.details }
    );
  }
} 