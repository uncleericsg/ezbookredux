import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import type {
  CreatePaymentIntentParams,
  PaymentIntentResponse,
  PaymentError,
  ApiResponse
} from '@/types';
import { logger } from '@/utils/logger';

const API_ENDPOINTS = {
  createPaymentIntent: '/api/payments/create-payment-intent',
  getReceipt: '/api/payments/receipt',
  generateReceipt: '/api/payments/receipt/generate'
};

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      logger.error('Stripe publishable key is missing');
      throw new Error('Stripe configuration error');
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const createPaymentIntent = async (
  params: CreatePaymentIntentParams
): Promise<ApiResponse<PaymentIntentResponse>> => {
  try {
    const response = await fetch(API_ENDPOINTS.createPaymentIntent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Failed to create payment intent', { error });
      throw new Error(error.message || 'Payment initialization failed');
    }

    const data = await response.json();
    logger.info('Payment intent created', { paymentIntentId: data.paymentIntentId });
    return { data };
  } catch (error) {
    logger.error('Payment intent creation failed', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Payment initialization failed',
        code: 'PAYMENT_ERROR'
      }
    };
  }
};

export const confirmPayment = async (
  clientSecret: string
): Promise<ApiResponse<PaymentIntentResponse>> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { paymentIntent, error } = await stripe.confirmPayment({
      clientSecret,
      redirect: 'if_required'
    });

    if (error) {
      logger.error('Payment confirmation failed', { error });
      throw error;
    }

    if (!paymentIntent) {
      throw new Error('No payment intent returned');
    }

    logger.info('Payment confirmed', { paymentIntentId: paymentIntent.id });
    return {
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!
      }
    };
  } catch (error) {
    logger.error('Payment confirmation failed', { error });
    return {
      error: {
        message: error instanceof Error ? error.message : 'Payment confirmation failed',
        code: 'PAYMENT_ERROR'
      }
    };
  }
};