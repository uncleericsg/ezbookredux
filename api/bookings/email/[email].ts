import type { NextApiResponse } from 'next';
import { withAuth } from '@server/api/middleware/auth';
import { BookingService } from '@server/services/bookings/BookingService';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { supabaseClient } from '@server/config/supabase/client';
import { AuthenticatedRequest } from '@server/types/api';
import { 
  BookingListResponse,
  BookingFilters,
  BookingValidationError,
  BookingStatus
} from '@shared/types/booking';

interface ApiResponse {
  data?: BookingListResponse;
  error?: {
    message: string;
    code: string;
    details?: BookingValidationError[];
  };
}

/**
 * Get bookings for a customer by email address
 * GET /api/bookings/email/[email]
 * Requires authentication and admin privileges
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const bookingService = new BookingService();

  if (req.method !== 'GET') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  // Verify admin privileges
  if (!req.user.is_admin) {
    throw new ApiError('Unauthorized access', 'UNAUTHORIZED');
  }

  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    throw new ApiError('Invalid email address', 'VALIDATION_ERROR');
  }

  try {
    // Get customer ID from email
    const { data: customer, error: customerError } = await supabaseClient
      .from('customers')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (customerError || !customer) {
      logger.warn('Customer not found', { email });
      throw new ApiError('Customer not found', 'NOT_FOUND');
    }

    // Extract and validate query parameters
    const filters: BookingFilters = {
      customer_id: customer.id
    };

    // Add optional filters
    if (typeof req.query.status === 'string') {
      if (!isValidBookingStatus(req.query.status)) {
        throw new ApiError('Invalid booking status', 'VALIDATION_ERROR');
      }
      filters.status = req.query.status as BookingStatus;
    }

    if (req.query.startDate && req.query.endDate) {
      if (typeof req.query.startDate !== 'string' || typeof req.query.endDate !== 'string') {
        throw new ApiError('Invalid date range', 'VALIDATION_ERROR');
      }
      filters.date_range = {
        start: req.query.startDate,
        end: req.query.endDate
      };
    }

    // Get bookings for the customer with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const bookings = await bookingService.listBookings(filters, { page, limit });

    logger.info('Retrieved customer bookings by email', { 
      email: customer.email,
      customerId: customer.id,
      filters,
      count: bookings.items.length,
      total: bookings.total,
      adminId: req.user.id
    });
    
    return res.status(200).json({
      data: bookings
    });

  } catch (error) {
    logger.error('Error in email bookings handler', { 
      error,
      email,
      adminId: req.user.id
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

// Type guard for booking status
function isValidBookingStatus(status: string): status is BookingStatus {
  return ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled', 'no_show'].includes(status);
}

export default withAuth(handler); 