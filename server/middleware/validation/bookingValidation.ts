import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '@server/utils/logger';

// Validation schemas
const CustomerInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(8, 'Mobile number must be at least 8 characters'),
  floor_unit: z.string().min(1, 'Floor/Unit is required'),
  block_street: z.string().min(1, 'Block/Street is required'),
  postal_code: z.string().min(6, 'Postal code must be at least 6 characters'),
  condo_name: z.string().optional(),
  lobby_tower: z.string().optional(),
  special_instructions: z.string().optional()
});

const CreateBookingSchema = z.object({
  customer_info: CustomerInfoSchema,
  service_id: z.string().min(1, 'Service ID is required'),
  service_title: z.string().min(1, 'Service title is required'),
  service_price: z.number().min(0, 'Service price must be non-negative'),
  service_duration: z.string().min(1, 'Service duration is required'),
  service_description: z.string().optional(),
  brands: z.array(z.string()).min(1, 'At least one brand is required'),
  issues: z.array(z.string()).min(1, 'At least one issue is required'),
  other_issue: z.string().optional(),
  is_amc: z.boolean(),
  scheduled_datetime: z.string().or(z.date()),
  scheduled_timeslot: z.string().min(1, 'Time slot is required'),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  payment_status: z.string().optional(),
  payment_intent_id: z.string().optional(),
  total_amount: z.number().optional(),
  tip_amount: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

const UpdateBookingSchema = CreateBookingSchema.partial();

// Validation middleware functions
export const validateCreateBooking = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateBookingSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Booking validation failed', { error: error.errors });
      return res.status(400).json({
        error: {
          message: 'Invalid booking data',
          details: error.errors,
          code: 'VALIDATION_ERROR'
        }
      });
    }
    next(error);
  }
};

export const validateUpdateBooking = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = UpdateBookingSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Booking update validation failed', { error: error.errors });
      return res.status(400).json({
        error: {
          message: 'Invalid booking update data',
          details: error.errors,
          code: 'VALIDATION_ERROR'
        }
      });
    }
    next(error);
  }
};

export const validateBookingId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.length < 1) {
    return res.status(400).json({
      error: {
        message: 'Invalid booking ID',
        code: 'INVALID_BOOKING_ID'
      }
    });
  }
  next();
};

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;
  try {
    z.string().email().parse(email);
    next();
  } catch (error) {
    return res.status(400).json({
      error: {
        message: 'Invalid email format',
        code: 'INVALID_EMAIL'
      }
    });
  }
};

export const validateCustomerId = (req: Request, res: Response, next: NextFunction) => {
  const { customerId } = req.params;
  if (!customerId || typeof customerId !== 'string' || customerId.length < 1) {
    return res.status(400).json({
      error: {
        message: 'Invalid customer ID',
        code: 'INVALID_CUSTOMER_ID'
      }
    });
  }
  next();
}; 