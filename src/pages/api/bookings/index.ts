import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../../services/bookingService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const listBookingsSchema = z.object({
  status: z.array(z.enum(['pending', 'confirmed', 'completed', 'cancelled'])).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  service_id: z.string().uuid().optional()
});

const bookingService = new BookingService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  try {
    const filters = listBookingsSchema.parse(req.query);
    const bookings = await bookingService.listBookings(req.user.id, filters);
    return res.status(200).json(createApiResponse(bookings));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 