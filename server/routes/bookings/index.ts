import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  createBooking,
  updateBooking,
  getBookingById,
  getBookingsByEmail,
  getBookingsByCustomerId
} from '@server/services/bookings/bookingService';
import type { CreateBookingParams, UpdateBookingParams } from '@shared/types/booking';
import { logger } from '@server/utils/logger';
import {
  validateCreateBooking,
  validateUpdateBooking,
  validateBookingId,
  validateEmail,
  validateCustomerId
} from '@server/middleware/validation/bookingValidation';
import { asyncHandler, APIError } from '@server/middleware/errorHandling';

const router = Router();

// Create a new booking
router.post('/', validateCreateBooking, asyncHandler(async (req: Request, res: Response) => {
  const bookingParams = req.body as CreateBookingParams;
  const result = await createBooking(bookingParams);

  if (result.error) {
    logger.error('Failed to create booking', { error: result.error });
    throw new APIError(result.error.message, result.error.code);
  }

  res.status(201).json(result);
}));

// Update a booking
router.patch('/:id', validateBookingId, validateUpdateBooking, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateParams = req.body as UpdateBookingParams;
  const result = await updateBooking(id, updateParams);

  if (result.error) {
    logger.error('Failed to update booking', { error: result.error, bookingId: id });
    throw new APIError(result.error.message, result.error.code);
  }

  res.json(result);
}));

// Get booking by ID
router.get('/:id', validateBookingId, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getBookingById(id);

  if (result.error) {
    logger.error('Failed to get booking', { error: result.error, bookingId: id });
    throw new APIError(result.error.message, result.error.code, 404);
  }

  res.json(result);
}));

// Get bookings by email
router.get('/email/:email', validateEmail, asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await getBookingsByEmail(email);

  if (result.error) {
    logger.error('Failed to get bookings by email', { error: result.error, email });
    throw new APIError(result.error.message, result.error.code);
  }

  res.json(result);
}));

// Get bookings by customer ID
router.get('/customer/:customerId', validateCustomerId, asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const result = await getBookingsByCustomerId(customerId);

  if (result.error) {
    logger.error('Failed to get bookings by customer ID', { error: result.error, customerId });
    throw new APIError(result.error.message, result.error.code);
  }

  res.json(result);
}));

export default router; 