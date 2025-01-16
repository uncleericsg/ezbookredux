import { NextApiRequest, NextApiResponse } from 'next';
import { TimeSlotService } from '../../../services/timeSlotService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const getTimeSlotsSchema = z.object({
  service_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  technician_id: z.string().uuid().optional()
});

const timeSlotService = new TimeSlotService();

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
    const validatedData = getTimeSlotsSchema.parse(req.query);
    const slots = await timeSlotService.getAvailableTimeSlots(validatedData);
    return res.status(200).json(createApiResponse(slots));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 