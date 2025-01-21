import express, { RequestHandler } from 'express';
import type { 
  CreatePaymentIntentParams, 
  PaymentConfig, 
  RefundParams 
} from '@shared/types/payment';
import { StripeService } from '@/services/payments/stripeService';
import { handleValidationError, handlePaymentError } from '@/utils/apiErrors';
import { logger } from '@/utils/logger';

const router = express.Router();

// Initialize Stripe service
const stripeConfig: PaymentConfig = {
  provider: 'stripe',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  supportedMethods: ['card', 'paynow', 'grabpay']
};

const stripeService = new StripeService(stripeConfig);

// Create payment intent handler
const createPaymentIntentHandler: RequestHandler = async (req, res, next) => {
  try {
    const params: CreatePaymentIntentParams = {
      amount: req.body.amount,
      currency: req.body.currency,
      metadata: req.body.metadata,
      paymentMethod: req.body.paymentMethod
    };

    const paymentIntent = await stripeService.createPaymentIntent(params);

    logger.info('Payment intent created:', { paymentIntentId: paymentIntent.id });
    return res.json(paymentIntent);
  } catch (error) {
    next(error);
  }
};

// Get payment intent handler
const getPaymentIntentHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw handleValidationError('Payment intent ID is required');
    }

    const paymentIntent = await stripeService.getPaymentIntent(id);
    return res.json(paymentIntent);
  } catch (error) {
    next(error);
  }
};

// Process refund handler
const createRefundHandler: RequestHandler = async (req, res, next) => {
  try {
    const params: RefundParams = {
      paymentIntentId: req.body.paymentIntentId,
      amount: req.body.amount,
      reason: req.body.reason,
      metadata: req.body.metadata
    };

    await stripeService.createRefund(params);
    logger.info('Refund processed:', { paymentIntentId: params.paymentIntentId });
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Webhook handler
const webhookHandler: RequestHandler = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    if (!signature || typeof signature !== 'string') {
      throw handleValidationError('Missing stripe-signature header');
    }

    const event = stripeService.verifyWebhookEvent(req.body, signature);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info('Payment succeeded:', { paymentIntentId: event.data.object.id });
        // Add your business logic here
        break;
      case 'payment_intent.payment_failed':
        logger.error('Payment failed:', { paymentIntentId: event.data.object.id });
        // Add your business logic here
        break;
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

// Register routes
router.post('/create-payment-intent', express.json(), createPaymentIntentHandler);
router.get('/payment-intent/:id', getPaymentIntentHandler);
router.post('/refund', express.json(), createRefundHandler);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default router;