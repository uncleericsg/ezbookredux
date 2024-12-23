import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { config } from 'dotenv';

config(); // Load environment variables

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
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
    
    const { 
      amount, 
      tipAmount = 0,
      currency = 'SGD',
      serviceId,
      customerId,
      bookingId 
    } = req.body as CreatePaymentIntentRequest;

    if (!amount || !serviceId || !bookingId) {
      console.error('Missing required parameters:', { amount, serviceId, bookingId });
      return res.status(400).json({
        error: 'Missing required parameters',
        details: { amount, serviceId, bookingId }
      });
    }

    const totalAmount = Math.round((amount + tipAmount) * 100);
    console.log('Creating payment intent:', {
      totalAmount,
      currency: currency.toLowerCase(),
      serviceId,
      customerId,
      bookingId
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
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
        baseAmount: amount,
        tipAmount,
        createdAt: new Date().toISOString()
      }
    });

    console.log('Payment intent created successfully:', paymentIntent.id);
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    
    if (err instanceof Stripe.errors.StripeError) {
      return res.status(err.statusCode || 500).json({
        error: err.message,
        type: err.type,
        code: err.code
      });
    }
    
    return res.status(500).json({
      error: 'Failed to create payment intent',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// Webhook handling
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing webhook signature or secret');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment
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

// Payment confirmation endpoint
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing payment intent ID'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      return res.json({ 
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata
        }
      });
    } else {
      return res.json({
        success: false,
        status: paymentIntent.status
      });
    }
  } catch (err) {
    console.error('Error confirming payment:', err);
    return res.status(500).json({
      error: 'Failed to confirm payment'
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
      return res.json({ 
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
      return res.status(400).json({ 
        error: 'Payment not successful',
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return res.status(500).json({
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

    return res.json({ 
      success: true,
      message: 'Service request queued successfully',
      serviceRequest
    });
  } catch (error) {
    console.error('Error adding to service queue:', error);
    return res.status(500).json({
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
    return res.json({ 
      success: true,
      message: 'Error logged successfully'
    });
  } catch (error) {
    console.error('Error logging payment error:', error);
    return res.status(500).json({
      error: 'Failed to log payment error'
    });
  }
});

export default router;
