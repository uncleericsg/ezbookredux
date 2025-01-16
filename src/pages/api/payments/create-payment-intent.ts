import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '../../../services/paymentService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { CreatePaymentIntentRequest } from '../../../types/payment';
import { errorHandler } from '../../../middleware/errorHandler';
import { z } from 'zod';

const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
  booking_id: z.string().uuid(),
  metadata: z.record(z.string()).optional()
});

const paymentService = new PaymentService();

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
    const validatedData = createPaymentIntentSchema.parse(req.body);
    const paymentIntent = await paymentService.createPaymentIntent(validatedData);
    
    return res.status(201).json(
      createApiResponse(paymentIntent)
    );
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 