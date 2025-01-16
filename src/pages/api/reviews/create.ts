import { NextApiRequest, NextApiResponse } from 'next';
import { ReviewService } from '../../../services/reviewService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { z } from 'zod';

const createReviewSchema = z.object({
  booking_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

const reviewService = new ReviewService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  try {
    // TODO: Get user_id from authenticated session
    const user_id = 'test-user-id';

    const validatedData = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(user_id, validatedData);
    
    return res.status(201).json(
      createApiResponse(review)
    );
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 