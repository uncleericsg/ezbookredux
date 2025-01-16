import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '../../../../services/paymentService';
import { createApiResponse, createApiError } from '../../../../utils/apiResponse';
import { errorHandler } from '../../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/authMiddleware';

const paymentService = new PaymentService();

async function handler(
  req: AuthenticatedRequest,
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
      createApiError('Invalid payment ID', 'VALIDATION_ERROR')
    );
  }

  try {
    const payment = await paymentService.getPaymentDetails(id);
    return res.status(200).json(createApiResponse(payment));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

export default withAuth(handler); 