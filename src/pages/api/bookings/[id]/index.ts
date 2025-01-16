import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../../../services/bookingService';
import { createApiResponse, createApiError } from '../../../../utils/apiResponse';
import { errorHandler } from '../../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/authMiddleware';
import { z } from 'zod';

const updateBookingSchema = z.object({
  scheduled_start: z.string().datetime().optional(),
  scheduled_end: z.string().datetime().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional()
});

const bookingService = new BookingService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json(
      createApiError('Invalid booking ID', 'VALIDATION_ERROR')
    );
  }

  try {
    const validatedData = updateBookingSchema.parse(req.body);
    const booking = await bookingService.updateBooking(req.user.id, id, validatedData);
    return res.status(200).json(createApiResponse(booking));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 