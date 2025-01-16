import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '../../../../services/paymentService';
import { createApiResponse, createApiError } from '../../../../utils/apiResponse';
import { errorHandler } from '../../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/authMiddleware';
import { z } from 'zod';

const refundSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional()
});

const paymentService = new PaymentService();

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
      createApiError('Invalid payment ID', 'VALIDATION_ERROR')
    );
  }

  // Only admins can process refunds
  if (req.user.role !== 'admin') {
    return res.status(403).json(
      createApiError('Insufficient permissions', 'AUTH_INVALID')
    );
  }

  try {
    const validatedData = refundSchema.parse(req.body);
    await paymentService.refundPayment(id, validatedData);
    return res.status(200).json(createApiResponse({ success: true }));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 