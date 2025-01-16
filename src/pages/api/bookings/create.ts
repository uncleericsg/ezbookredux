import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../../services/bookingService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { CreateBookingRequest } from '../../../types/booking';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const createBookingSchema = z.object({
  service_id: z.string().uuid(),
  address_id: z.string().uuid(),
  scheduled_start: z.string().datetime(),
  scheduled_end: z.string().datetime(),
  notes: z.string().optional()
});

const bookingService = new BookingService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  try {
    const validatedData = createBookingSchema.parse(req.body);
    const booking = await bookingService.createBooking({
      ...validatedData,
      user_id: req.user.id // Use authenticated user's ID
    });
    
    return res.status(201).json(
      createApiResponse({
        id: booking.id,
        status: booking.status,
        bookingReference: `BK-${booking.id.slice(0, 8)}`,
        scheduled_start: booking.scheduled_start,
        scheduled_end: booking.scheduled_end,
        total_amount: booking.total_amount
      })
    );
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

// Protect the endpoint for authenticated customers only
export default withAuth(handler, ['customer']); 