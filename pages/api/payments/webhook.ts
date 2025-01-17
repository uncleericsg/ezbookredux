import { NextApiRequest, NextApiResponse } from 'next';
import { PaymentService } from '@server/services/payments/PaymentService';
import { withErrorHandler } from '@server/middleware/withErrorHandler';
import { buffer } from 'micro';
import { logger } from '@server/utils/logger';

const paymentService = new PaymentService();

// Disable body parsing, need raw body for Stripe webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const rawBody = await buffer(req);
    
    // Log webhook event for debugging
    logger.info('Received Stripe webhook event');
    
    await paymentService.handleWebhook(rawBody.toString(), signature as string);
    
    logger.info('Successfully processed Stripe webhook event');
    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    return res.status(400).json({
      error: 'Webhook error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Only apply error handler, no auth for webhooks
export default withErrorHandler(handler); 