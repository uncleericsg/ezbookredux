import express, { RequestHandler } from 'express';
import Stripe from 'stripe';

// Type definitions for Stripe webhook events
interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

const router = express.Router();

// Initialize Stripe with error handling
const initializeStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!secretKey || !webhookSecret) {
    throw new Error('STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables are required');
  }

  return new Stripe(secretKey, {
    apiVersion: '2023-10-16',
    typescript: true
  });
};

const stripe = initializeStripe();

// Create payment intent handler
const createPaymentIntentHandler: RequestHandler = async (req, res, next) => {
  try {
    const { amount, currency = 'sgd' } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount. Must be a positive number.' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: unknown) {
    console.error('Payment intent creation failed:', err);
    if (err instanceof Stripe.errors.StripeError) {
      return res.status(err.statusCode || 500).json({ error: err.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Webhook handler
const webhookHandler: RequestHandler = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ 
      error: 'Missing stripe-signature header or webhook secret' 
    });
  }

  let event: StripeWebhookEvent;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    ) as StripeWebhookEvent;
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err);
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.error('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ received: true });
};

// Register routes
router.post('/create-payment-intent', express.json(), createPaymentIntentHandler);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;