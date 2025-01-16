import { NextApiRequest, NextApiResponse } from 'next';
import { ReviewService } from '../../../services/reviewService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';

const reviewService = new ReviewService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json(
      createApiError('Invalid review ID', 'VALIDATION_ERROR')
    );
  }

  try {
    const review = await reviewService.getReview(id);
    return res.status(200).json(createApiResponse(review));
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 