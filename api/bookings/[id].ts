import type { NextApiResponse } from 'next';
import { withAuth } from '@server/api/middleware/auth';
import { BookingService } from '@server/services/bookings/BookingService';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { AuthenticatedRequest } from '@server/types/api';
import { 
  Booking,
  BookingStatus,
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

type BookingAction = 'cancel' | 'reschedule' | 'complete';

interface BookingActionRequest {
  action: BookingAction;
  reason?: string;
  newDate?: string;
}

/**
 * Handle booking operations by ID
 * GET /api/bookings/[id] - Get booking details
 * POST /api/bookings/[id] - Update booking status (cancel, reschedule, complete)
 * Requires authentication
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const bookingService = new BookingService();

  if (req.method !== 'GET' && req.method !== 'POST') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    throw new ApiError('Invalid booking ID', 'VALIDATION_ERROR');
  }

  try {
    // First verify the user has access to this booking
    const booking = await bookingService.getBooking(id);
    if (!booking) {
      throw new ApiError('Booking not found', 'NOT_FOUND');
    }

    // Verify user has permission to access this booking
    if (booking.customer_id !== req.user.id) {
      throw new ApiError('Unauthorized access', 'UNAUTHORIZED');
    }

    switch (req.method) {
      case 'GET':
        logger.info('Fetching booking details', { 
          bookingId: id,
          userId: req.user.id 
        });
        
        return res.status(200).json({
          data: booking
        });

      case 'POST':
        const actionRequest = req.body as BookingActionRequest;
        
        switch (actionRequest.action) {
          case 'cancel':
            logger.info('Cancelling booking', { 
              bookingId: id,
              userId: req.user.id,
              reason: actionRequest.reason 
            });
            
            const cancelledBooking = await bookingService.updateBookingStatus(
              id,
              'cancelled',
              { reason: actionRequest.reason }
            );
            return res.status(200).json({
              data: cancelledBooking
            });

          case 'reschedule':
            if (!actionRequest.newDate) {
              throw new ApiError('New date is required for rescheduling', 'VALIDATION_ERROR');
            }
            
            logger.info('Rescheduling booking', { 
              bookingId: id,
              userId: req.user.id,
              newDate: actionRequest.newDate 
            });
            
            const rescheduledBooking = await bookingService.rescheduleBooking(
              id,
              actionRequest.newDate
            );
            return res.status(200).json({
              data: rescheduledBooking
            });

          case 'complete':
            logger.info('Completing booking', { 
              bookingId: id,
              userId: req.user.id 
            });
            
            const completedBooking = await bookingService.updateBookingStatus(
              id,
              'completed'
            );
            return res.status(200).json({
              data: completedBooking
            });

          default:
            throw new ApiError('Invalid action', 'VALIDATION_ERROR');
        }

      default:
        throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
    }
  } catch (error) {
    logger.error('Error in booking handler', { 
      error,
      bookingId: id,
      userId: req.user.id,
      method: req.method 
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