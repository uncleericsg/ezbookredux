import type { NextApiResponse } from 'next';
import { withAuth } from '@/api/shared/middleware';
import { listBookings } from '@/server/services/bookings/bookingService';
import { ApiError } from '@/server/utils/apiErrors';
import { logger } from '@/server/utils/logger';
import type { AuthenticatedRequest } from '@/api/shared/types';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { customerId } = req.query;
  if (!customerId || typeof customerId !== 'string') {
    throw new ApiError('Invalid customer ID', 'VALIDATION_ERROR');
  }

  // Only allow users to view their own bookings
  if (customerId !== req.user.id) {
    throw new ApiError('Unauthorized access', 'UNAUTHORIZED');
  }

  try {
    // Extract query parameters
    const { status, startDate, endDate } = req.query;

    // Get bookings for the customer
    const bookings = await listBookings(
      customerId,
      typeof status === 'string' ? status : undefined,
      typeof startDate === 'string' ? startDate : undefined,
      typeof endDate === 'string' ? endDate : undefined
    );

    logger.info('Retrieved customer bookings', { customerId, count: bookings.length });
    
    return res.status(200).json({
      data: bookings
    });
  } catch (error) {
    logger.error('Error in customer bookings handler', { error, customerId });
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