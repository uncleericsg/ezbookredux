import { Router, Response, Request } from 'express';
import Stripe from 'stripe';
import { stripeConfig } from '@/config/stripe';

const router = Router();
const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2023-10-16'
});

interface PaymentIntentWithCharges extends Stripe.PaymentIntent {
  charges?: Stripe.ApiList<Stripe.Charge>;
}

interface ReceiptResponse {
  receiptUrl?: string;
  error?: string;
}

// Get Stripe receipt URL
router.get('/:paymentIntentId/receipt', 
  async (req: Request<{ paymentIntentId: string }>, res: Response<ReceiptResponse>): Promise<void> => {
    try {
      const { paymentIntentId } = req.params;
      
      // Validate payment intent ID
      if (!paymentIntentId || typeof paymentIntentId !== 'string') {
        res.status(400).json({ error: 'Invalid payment intent ID' });
        return;
      }

      // Retrieve payment intent with expanded charges
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['charges']
      }) as PaymentIntentWithCharges;

      // Get receipt URL from the first charge
      const receiptUrl = paymentIntent.charges?.data?.[0]?.receipt_url;
      if (!receiptUrl) {
        res.status(404).json({ error: 'Receipt not found' });
        return;
      }

      res.json({ receiptUrl });
    } catch (error) {
      console.error('Error getting Stripe receipt:', error);
      res.status(500).json({ error: 'Failed to get receipt' });
    }
  }
);

export default router;
