import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { config } from 'dotenv';

config(); // Load environment variables

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

const router = express.Router();

// Enable CORS for your frontend domain
router.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  methods: ['POST', 'GET'],
  credentials: true,
}));

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Received payment intent request:', req.body);
    const { amount, currency = 'sgd', serviceId, customerId, bookingId } = req.body;

    if (!amount) {
      console.log('Missing amount in request');
      return res.status(400).json({
        error: 'Missing required parameter: amount'
      });
    }

    const amountInCents = Math.round(amount * 100);
    console.log('Creating payment intent for amount:', amountInCents, 'currency:', currency);

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      },
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
          setup_future_usage: 'off_session'
        }
      },
      metadata: {
        serviceId,
        customerId,
        bookingId,
        createdAt: new Date().toISOString()
      }
    });

    console.log('Payment intent created successfully:', paymentIntent.id);
    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (err) {
    console.error('Detailed error creating payment intent:', err);
    if (err instanceof Error) {
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      if ('type' in err) {
        console.error('Stripe error type:', (err as any).type);
      }
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to create payment intent',
      details: process.env.NODE_ENV !== 'production' ? err : undefined
    });
  }
});

// Consolidated payment confirmation endpoint
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing payment intent ID'
      });
    }

    // Retrieve and verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Payment successful, send confirmation with metadata
      res.json({ 
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          paymentMethod: paymentIntent.payment_method,
          metadata: paymentIntent.metadata
        }
      });
    } else {
      // Payment not successful
      res.status(400).json({ 
        error: 'Payment not successful',
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to confirm payment'
    });
  }
});

// Service queue endpoint
router.post('/queue', async (req, res) => {
  try {
    const { customerId, serviceId, scheduledDate, status, paymentConfirmed } = req.body;

    // Log the received data
    console.log('Queue request received:', req.body);

    // More flexible validation
    if (!serviceId) {
      return res.status(400).json({
        error: 'Missing service details',
        details: 'serviceId is required'
      });
    }

    // Create service request with available data
    const serviceRequest = {
      serviceId,
      customerId: customerId || 'anonymous',
      scheduledDate: scheduledDate || new Date().toISOString(),
      status: status || 'pending',
      paymentConfirmed: paymentConfirmed || true
    };

    // Here you would typically add the service request to your database
    console.log('Adding service request to queue:', serviceRequest);

    res.json({ 
      success: true,
      message: 'Service request queued successfully',
      serviceRequest
    });
  } catch (error) {
    console.error('Error adding to service queue:', error);
    res.status(500).json({
      error: 'Failed to add to service queue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Payment error logging endpoint
router.post('/error', async (req, res) => {
  try {
    const { error } = req.body;

    if (!error) {
      return res.status(400).json({
        error: 'Missing error details'
      });
    }

    // Here you would typically log the error to your database or logging service
    // For now, we'll just return success
    res.json({ 
      success: true,
      message: 'Error logged successfully'
    });
  } catch (error) {
    console.error('Error logging payment error:', error);
    res.status(500).json({
      error: 'Failed to log payment error'
    });
  }
});

// Basic webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig || '',
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Here we would update our database
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
});

export default router;
