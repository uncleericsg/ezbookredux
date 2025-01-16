import { Router, Response } from 'express';
import Stripe from 'stripe';
import { stripeConfig } from '@config/stripe'; // Updated import path
import { PaymentIntentWithCharges } from '@types/stripe'; // Added type import

const router = Router();
const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2023-08-16'
});

// Get Stripe receipt URL
router.get<{ paymentIntentId: string }, { receiptUrl?: string, error?: string }>(
  '/:paymentIntentId/receipt', 
  async (req, res: Response<{ receiptUrl?: string, error?: string }>): Promise<Response> => {
    try {
      const { paymentIntentId } = req.params;
      
      // Validate payment intent ID
      if (!paymentIntentId || typeof paymentIntentId !== 'string') {
        return res.status(400).json({ error: 'Invalid payment intent ID' });
      }

      // Retrieve payment intent with expanded charges
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['charges']
      }) as PaymentIntentWithCharges;

      // Get receipt URL from the first charge
      const receiptUrl = paymentIntent.charges?.data?.[0]?.receipt_url;
      if (!receiptUrl) {
        return res.status(404).json({ error: 'Receipt not found' });
      }

      return res.json({ receiptUrl });
    } catch (error) {
      console.error('Error getting Stripe receipt:', error);
      return res.status(500).json({ error: 'Failed to get receipt' });
    }
  }
);

export default router;
