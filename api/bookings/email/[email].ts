import type { NextApiResponse } from 'next';
import { withAuth } from '@/api/shared/middleware';
import { listBookings } from '@/server/services/bookings/bookingService';
import { ApiError } from '@/server/utils/apiErrors';
import { logger } from '@/server/utils/logger';
import { supabaseClient } from '@/server/config/supabase/client';
import type { AuthenticatedRequest } from '@/api/shared/types';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    throw new ApiError('Invalid email address', 'VALIDATION_ERROR');
  }

  try {
    // Get customer ID from email
    const { data: customer, error: customerError } = await supabaseClient
      .from('customers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (customerError || !customer) {
      throw new ApiError('Customer not found', 'NOT_FOUND');
    }

    // Extract query parameters
    const { status, startDate, endDate } = req.query;

    // Get bookings for the customer
    const bookings = await listBookings(
      customer.id,
      typeof status === 'string' ? status : undefined,
      typeof startDate === 'string' ? startDate : undefined,
      typeof endDate === 'string' ? endDate : undefined
    );

    logger.info(`Retrieved ${bookings.length} bookings for email ${email}`);
    
    return res.status(200).json({
      data: bookings
    });
  } catch (error) {
    logger.error('Error in email bookings handler', { error, email });
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