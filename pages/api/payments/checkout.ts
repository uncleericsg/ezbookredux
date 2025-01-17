import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '@server/services/payments/PaymentService';
import { withErrorHandler } from '@server/middleware/withErrorHandler';
import { withAuth } from '@server/middleware/withAuth';

const paymentService = new PaymentService();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Handle checkout session creation
    const { bookingId, amount, currency, customerEmail, metadata } = req.body;
    const userId = req.user.id; // From auth middleware

    const result = await paymentService.initiatePayment({
      bookingId,
      userId,
      amount,
      currency,
      customerEmail,
      metadata
    });

    return res.status(200).json(result);
  } 
  
  if (req.method === 'GET') {
    // Handle payment status check
    const { session_id } = req.query;
    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Missing session_id parameter' });
    }

    const session = await paymentService.getPaymentStatus(session_id);
    return res.status(200).json(session);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Apply middleware
export default withErrorHandler(withAuth(handler)); 