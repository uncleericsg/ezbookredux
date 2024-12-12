import { loadStripe, StripeError } from '@stripe/stripe-js';
import axios from 'axios';
import { z } from 'zod';
import { ApiError, handleApiError, retryOperation } from '../utils/apiErrors';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Validation schemas
const paymentIntentSchema = z.object({
  clientSecret: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  metadata: z.record(z.string()).optional()
});

interface PaymentOptions {
  idempotencyKey?: string;
  description?: string;
  metadata?: Record<string, string>;
  receiptEmail?: string;
}

let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      throw new ApiError(
        'Stripe publishable key is not set in environment variables',
        'STRIPE_ERROR',
        { context: 'Stripe Initialization' }
      );
    }
    try {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    } catch (error) {
      throw ApiError.fromStripeError(error);
    }
  }
  return stripePromise;
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'sgd',
  options: PaymentOptions = {}
) => {
  return retryOperation(
    async () => {
      try {
        const response = await axios.post('/api/payments/create-intent', {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          description: options.description,
          metadata: options.metadata,
          receipt_email: options.receiptEmail
        }, {
          headers: {
            'Idempotency-Key': options.idempotencyKey || crypto.randomUUID()
          }
        });

        const result = paymentIntentSchema.safeParse(response.data);
        if (!result.success) {
          throw new ApiError(
            'Invalid payment intent response',
            'STRIPE_VALIDATION_ERROR',
            { context: 'Payment Intent Creation' }
          );
        }

        return result.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new ApiError(
            error.response?.data?.message || 'Failed to create payment intent',
            'STRIPE_ERROR',
            {
              context: 'Payment Intent Creation',
              statusCode: error.response?.status,
              retryable: error.response?.status ? error.response.status >= 500 : true
            }
          );
        }
        throw ApiError.fromStripeError(error);
      }
    },
    'Payment Intent Creation',
    3
  );
};

export const confirmPayment = async (clientSecret: string) => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new ApiError(
      'Stripe not initialized',
      'STRIPE_ERROR',
      { context: 'Stripe Initialization' }
    );
  }

  try {
    const { paymentIntent, error } = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      throw ApiError.fromStripeError(error);
    }

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw ApiError.fromStripeError(error);
  }
};

export const handlePaymentSuccess = async (paymentIntentId: string) => {
  try {
    const response = await axios.post('/api/payments/success', {
      paymentIntentId
    });
    return response.data;
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw handleApiError(error);
  }
};

export const handlePaymentFailure = async (paymentIntentId: string, error: any) => {
  try {
    await axios.post('/api/payments/failure', {
      paymentIntentId,
      error: {
        type: error.type,
        message: error.message,
        code: error.code
      }
    });
    
    // Log failure for analytics
    console.error('Payment failed:', {
      paymentIntentId,
      errorType: error.type,
      errorMessage: error.message,
      errorCode: error.code
    });
    
    // Show appropriate error message to user
    if (error.type === 'card_error') {
      throw new ApiError(
        'Your card was declined. Please try another card.',
        'STRIPE_CARD_ERROR',
        { context: 'Payment Failure' }
      );
    } else if (error.type === 'validation_error') {
      throw new ApiError(
        'Please check your card details and try again.',
        'STRIPE_VALIDATION_ERROR',
        { context: 'Payment Failure' }
      );
    } else {
      throw new ApiError(
        'Payment failed. Please try again later.',
        'STRIPE_ERROR',
        { context: 'Payment Failure' }
      );
    }
  } catch (err) {
    console.error('Error handling payment failure:', err);
    throw handleApiError(err);
  }
}