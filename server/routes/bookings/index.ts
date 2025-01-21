import { Router } from 'express';
import type { Request, Response } from 'express';
import { BookingService } from '@server/services/bookings/bookingService';
import type { CreateBookingInput, UpdateBookingInput, Booking } from '@shared/types/booking';
import type { RouteResponse } from '@shared/types/route';
import { routeBuilder } from '@server/utils/routeBuilder';
import { routeError } from '@server/utils/routeError';
import { logger } from '@server/utils/logger';
import { validate } from '@server/middleware/validation/bookingValidation';

/**
 * Booking router
 */
export const bookingsRouter = Router();
const bookingService = new BookingService();

/**
 * Create booking
 * POST /bookings
 */
const createBooking = routeBuilder.create<Request, RouteResponse<Booking>>()
  .method('POST')
  .path('/')
  .auth()
  .roles(['admin', 'customer'])
  .validation({
    body: validate.createBookingSchema
  })
  .handler(async (req, res) => {
    try {
      const result = await bookingService.createBooking(req.body as CreateBookingInput);
      return {
        data: result
      };
    } catch (error) {
      logger.error('Failed to create booking', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw routeError.internal('Failed to create booking');
    }
  })
  .build();

/**
 * Update booking
 * PATCH /bookings/:id
 */
const updateBooking = routeBuilder.create<Request, RouteResponse<Booking>>()
  .method('PATCH')
  .path('/:id')
  .auth()
  .roles(['admin', 'service_provider'])
  .validation({
    params: validate.bookingIdSchema,
    body: validate.updateBookingSchema
  })
  .handler(async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingService.updateBooking(id, req.body as UpdateBookingInput);
      return {
        data: result
      };
    } catch (error) {
      logger.error('Failed to update booking', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw routeError.internal('Failed to update booking');
    }
  })
  .build();

/**
 * Get booking
 * GET /bookings/:id
 */
const getBooking = routeBuilder.create<Request, RouteResponse<Booking>>()
  .method('GET')
  .path('/:id')
  .auth()
  .validation({
    params: validate.bookingIdSchema
  })
  .handler(async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingService.getBooking(id);
      if (!result) {
        throw routeError.notFound('Booking not found', 'BOOKING_NOT_FOUND');
      }
      return {
        data: result
      };
    } catch (error) {
      logger.error('Failed to get booking', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw routeError.internal('Failed to get booking');
    }
  })
  .build();

/**
 * Get bookings by email
 * GET /bookings/email/:email
 */
const getBookingsByEmail = routeBuilder.create<Request, RouteResponse<Booking[]>>()
  .method('GET')
  .path('/email/:email')
  .auth()
  .roles(['admin'])
  .validation({
    params: validate.emailSchema
  })
  .handler(async (req, res) => {
    try {
      const { email } = req.params;
      const result = await bookingService.listBookings({ email });
      return {
        data: result
      };
    } catch (error) {
      logger.error('Failed to get bookings by email', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw routeError.internal('Failed to get bookings by email');
    }
  })
  .build();

/**
 * Get bookings by customer ID
 * GET /bookings/customer/:customerId
 */
const getBookingsByCustomer = routeBuilder.create<Request, RouteResponse<Booking[]>>()
  .method('GET')
  .path('/customer/:customerId')
  .auth()
  .roles(['admin', 'service_provider'])
  .validation({
    params: validate.customerIdSchema
  })
  .handler(async (req, res) => {
    try {
      const { customerId } = req.params;
      const result = await bookingService.listBookings({ customerId });
      return {
        data: result
      };
    } catch (error) {
      logger.error('Failed to get bookings by customer', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw routeError.internal('Failed to get bookings by customer');
    }
  })
  .build();

// Error handler helper
const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    const status = error.name === 'RouteError' ? (error as any).statusCode || 500 : 500;
    res.status(status).json({
      error: {
        code: (error as any).code || 'INTERNAL_SERVER_ERROR',
        message: error.message
      }
    });
  } else {
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

// Register routes with correct order for path matching
bookingsRouter.get('/email/:email', (req: Request, res: Response) => {
  getBookingsByEmail.handler(req, res)
    .then(response => res.json(response))
    .catch(error => handleError(error, res));
});

bookingsRouter.get('/customer/:customerId', (req: Request, res: Response) => {
  getBookingsByCustomer.handler(req, res)
    .then(response => res.json(response))
    .catch(error => handleError(error, res));
});

bookingsRouter.get('/:id', (req: Request, res: Response) => {
  getBooking.handler(req, res)
    .then(response => res.json(response))
    .catch(error => handleError(error, res));
});

bookingsRouter.patch('/:id', (req: Request, res: Response) => {
  updateBooking.handler(req, res)
    .then(response => res.json(response))
    .catch(error => handleError(error, res));
});

bookingsRouter.post('/', (req: Request, res: Response) => {
  createBooking.handler(req, res)
    .then(response => res.status(201).json(response))
    .catch(error => handleError(error, res));
});

export default bookingsRouter;
