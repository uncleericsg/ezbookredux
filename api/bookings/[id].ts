import type { NextApiResponse } from 'next';
import { withAuth } from '@/api/shared/middleware';
import { getBooking, cancelBooking } from '@/server/services/bookings/bookingService';
import { ApiError } from '@/server/utils/apiErrors';
import { logger } from '@/server/utils/logger';
import type { AuthenticatedRequest } from '@/api/shared/types';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    throw new ApiError('Invalid booking ID', 'VALIDATION_ERROR');
  }

  try {
    switch (req.method) {
      case 'GET':
        const booking = await getBooking(id);
        return res.status(200).json({
          data: booking
        });

      case 'POST':
        // Handle cancellation
        if (req.body.action === 'cancel') {
          const result = await cancelBooking(id, req.user.id);
          return res.status(200).json({
            data: result
          });
        }
        throw new ApiError('Invalid action', 'VALIDATION_ERROR');

      default:
        throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
    }
  } catch (error) {
    logger.error('Error in booking handler', { error, id, method: req.method });
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