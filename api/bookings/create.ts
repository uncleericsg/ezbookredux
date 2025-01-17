import type { NextApiResponse } from 'next';
import { withAuth } from '@/api/shared/middleware';
import { createBooking } from '@/server/services/bookings/bookingService';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';
import type { AuthenticatedRequest } from '@/api/shared/types';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  try {
    const bookingData = req.body;
    
    // Add validation here if needed
    if (!bookingData.serviceId || !bookingData.date) {
      throw new ApiError('Missing required fields', 'VALIDATION_ERROR');
    }

    // Add the authenticated user's ID as the customer ID
    bookingData.customerId = req.user.id;

    const booking = await createBooking(bookingData);
    
    logger.info('Booking created successfully', { bookingId: booking.id });
    
    return res.status(201).json({
      data: booking
    });
  } catch (error) {
    logger.error('Error in booking creation handler', { error });
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
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