import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../../../services/bookingService';
import { createApiResponse, createApiError } from '../../../../utils/apiResponse';
import { errorHandler } from '../../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/authMiddleware';

const bookingService = new BookingService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'POST') {
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
    await bookingService.cancelBooking(req.user.id, id);
    return res.status(200).json(createApiResponse({ success: true }));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 