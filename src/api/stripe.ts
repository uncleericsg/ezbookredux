import express from 'express';
import Stripe from 'stripe';
import { config } from 'dotenv';
import { supabase } from '../lib/supabase.server';
import { v4 as uuidv4 } from 'uuid';

config(); // Load environment variables

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
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
      currency = 'SGD',
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

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount + tipAmount), // amount should already be in cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        serviceId,
        bookingId,
        customerId: customerId || '',
        tipAmount: tipAmount.toString(),
        baseAmount: amount.toString(),
        firebase_booking_id: bookingId // Store Firebase ID in metadata
      }
    });

    // Log success before database operation
    console.log('Created payment intent:', paymentIntent.id);

    try {
      // Generate a UUID for the payment record
      const paymentUuid = uuidv4();

      // Attempt to create payment record in Supabase
      const { error: dbError } = await supabase
        .from('payments')
        .insert([{
          id: paymentUuid,
          payment_intent_id: paymentIntent.id,
          amount: Math.round(amount + tipAmount),
          currency: currency.toLowerCase(),
          status: 'pending',
          customer_id: customerId || null,
          service_id: serviceId
        }]);

      if (dbError) {
        // Log database error but don't fail the request
        console.error('Database error creating payment:', dbError);
      }
    } catch (dbError) {
      // Log any other database errors but don't fail the request
      console.error('Unexpected database error:', dbError);
    }

    // Return successful response
    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'STRIPE_ERROR'
      }
    });
  }
});

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
