import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '../../../services/paymentService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';

const paymentService = new PaymentService();

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
    const payments = await paymentService.listPayments(req.user.id);
    return res.status(200).json(createApiResponse(payments));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 