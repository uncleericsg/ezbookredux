import express from 'express';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.server';
import { config } from 'dotenv';

config(); // Load environment variables

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const router = express.Router();

interface CreatePaymentIntentRequest {
  amount: number;
  tipAmount?: number;
  currency?: string;
  serviceId: string;
  customerId?: string;
  bookingId: string;
}

// Create payment intent endpoint
router.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Received payment intent request:', req.body);
    
    const { 
      amount, 
      tipAmount = 0,
      currency = 'sgd',
      serviceId,
      customerId,
      bookingId 
    } = req.body as CreatePaymentIntentRequest;

    // Validate required fields
    if (!amount || !serviceId || !bookingId) {
      return res.status(400).json({ 
        error: {
          message: 'Missing required fields',
          code: 'MISSING_FIELDS'
        }
      });
    }

    const { clientSecret, id } = await createPaymentIntent(amount, serviceId, bookingId, tipAmount, currency, customerId);

    // Return successful response
    res.json({
      clientSecret,
      intentId: id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to create payment intent',
        code: 'PAYMENT_INTENT_FAILED'
      }
    });
  }
});

export const createPaymentIntent = async (
  amount: number,
  serviceId: string,
  bookingId: string,
  tipAmount: number = 0,
  currency: string = 'sgd',
  customerId?: string,
): Promise<{ clientSecret: string; id: string }> => {
  try {
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((amount + tipAmount) * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Created payment intent:', paymentIntent.id);

    try {
      // Generate a UUID for the payment record
      const paymentUuid = uuidv4();

      // Validate UUIDs
      const isValidUUID = (str: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
      };

      // Create payment record
      const { error: dbError } = await supabase
        .from('payments')
        .insert([{
          id: paymentUuid,
          payment_intent_id: paymentIntent.id,
          amount: Math.round(amount),
          tip_amount: Math.round(tipAmount),
          currency: currency.toLowerCase(),
          status: 'pending',
          service_id: serviceId,
          customer_id: customerId && isValidUUID(customerId) ? customerId : null,
          booking_id: bookingId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (dbError) {
        console.error('Database error creating payment:', dbError);
        throw new Error(`Error creating payment record: ${dbError.message}`);
      }

      console.log('Payment record created successfully:', {
        id: paymentUuid,
        payment_intent_id: paymentIntent.id,
        booking_id: bookingId
      });

      return {
        clientSecret: paymentIntent.client_secret as string,
        id: paymentIntent.id
      };

    } catch (error) {
      console.error('Error creating payment record:', error);
      throw error;
    }

  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
};

// Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ 
      error: {
        message: 'Missing signature or webhook secret',
        code: 'INVALID_WEBHOOK'
      }
    });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      (req as any).rawBody,
      sig,
      webhookSecret
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(failedPayment);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ 
      error: {
        message: 'Webhook signature verification failed',
        code: 'WEBHOOK_VERIFICATION_FAILED'
      }
    });
  }
});

// Handle successful payment
const handleSuccessfulPayment = async (paymentIntent: Stripe.PaymentIntent) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'succeeded' })
      .eq('payment_intent_id', paymentIntent.id);

    if (error) throw error;
    console.log('Payment success recorded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Handle failed payment
const handleFailedPayment = async (paymentIntent: Stripe.PaymentIntent) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('payment_intent_id', paymentIntent.id);

    if (error) throw error;
    console.log('Payment failure recorded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

export default router;
