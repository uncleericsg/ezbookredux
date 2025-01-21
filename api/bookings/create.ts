import type { NextApiResponse } from 'next';
import { withAuth } from '@server/api/middleware/auth';
import { BookingService } from '@server/services/bookings/BookingService';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { AuthenticatedRequest } from '@server/types/api';
import { 
  Booking, 
  CreateBookingRequest, 
  BookingValidationResult,
  BookingValidationError 
} from '@shared/types/booking';

interface ApiResponse {
  data?: Booking;
  error?: {
    message: string;
    code: string;
    details?: BookingValidationError[];
  };
}

/**
 * Create a new booking
 * Requires authentication
 * POST /api/bookings/create
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const bookingService = new BookingService();

  if (req.method !== 'POST') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  try {
    const bookingData: CreateBookingRequest = {
      ...req.body,
      customer_id: req.user.id
    };

    // Validate booking data
    const validation: BookingValidationResult = await bookingService.validateBooking(bookingData);
    
    if (!validation.isValid) {
      logger.warn('Invalid booking data', { 
        userId: req.user.id,
        errors: validation.errors 
      });
      return res.status(400).json({
        error: {
          message: 'Invalid booking data',
          code: 'VALIDATION_ERROR',
          details: validation.errors
        }
      });
    }

    // Create booking
    const booking = await bookingService.createBooking(bookingData);
    
    logger.info('Booking created successfully', { 
      bookingId: booking.id,
      userId: req.user.id 
    });
    
    return res.status(201).json({
      data: booking
    });

  } catch (error) {
    logger.error('Error in booking creation handler', { 
      error,
      userId: req.user.id 
    });

    if (error instanceof ApiError) {
      return res.status(error.statusCode || 400).json({
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      });
    }

    return res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    });
  }
}

export default withAuth(handler); 