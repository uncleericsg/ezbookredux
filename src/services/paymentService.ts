import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentDetails, PaymentError, TransactionRecord } from '../types/payment';
import { ServiceRequest } from '../types/service';
import axios from 'axios';
import { getStripe } from './stripe';

let stripeInstance: Stripe | null = null;

export const initializeStripe = async (): Promise<Stripe | null> => {
  if (!stripeInstance) {
    try {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        console.error('No Stripe key provided');
        return null;
      }

      stripeInstance = await loadStripe(stripeKey);
      if (!stripeInstance) {
        console.error('Stripe instance creation failed');
        return null;
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
      return null;
    }
  }
  return stripeInstance;
};

export const createPaymentIntent = async (
  amount: number,
  serviceId: string,
  bookingId: string,
  tipAmount: number = 0,
  currency: string = 'sgd',
  customerId?: string,
): Promise<{ clientSecret: string; id: string }> => {
  try {
    console.log('Creating payment intent with full details:', { 
      amount, 
      serviceId, 
      bookingId, 
      tipAmount, 
      currency, 
      customerId,
      baseUrl: axios.defaults.baseURL,
      headers: axios.defaults.headers
    });
    
    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      throw new Error('Invalid payment amount');
    }

    if (!serviceId || !bookingId) {
      console.error('Missing required parameters:', { serviceId, bookingId });
      throw new Error('Service ID and Booking ID are required');
    }

    const paymentData = {
      amount,
      serviceId,
      bookingId,
      tipAmount,
      currency,
      customerId,
    };

    console.log('Sending payment request to:', '/api/payments/create-payment-intent');
    console.log('Payment request data:', paymentData);

    const response = await axios.post('/api/payments/create-payment-intent', paymentData);

    console.log('Payment intent response:', response.data);

    if (!response.data || !response.data.clientSecret) {
      console.error('Invalid response data:', response.data);
      throw new Error('Invalid response from payment server');
    }

    return {
      clientSecret: response.data.clientSecret,
      id: response.data.id
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Detailed Axios error:', {
        message: error.message,
        response: {
          data: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
        },
        request: {
          method: error.config?.method,
          url: error.config?.url,
          data: error.config?.data,
          headers: error.config?.headers,
        }
      });
      const errorMessage = error.response?.data?.error || error.message || 'Failed to initialize payment';
      throw new Error(errorMessage);
    }
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to initialize payment');
  }
};

export const handlePaymentSuccess = async (paymentIntent: any): Promise<void> => {
  try {
    console.log('Handling payment success:', paymentIntent);

    // Send confirmation to backend
    const confirmResponse = await axios.post('/api/payments/confirm', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method,
    });

    if (!confirmResponse.data.success) {
      throw new Error('Payment confirmation failed');
    }

    // Add to service queue if payment is successful
    if (paymentIntent.status === 'succeeded') {
      try {
        await addToServiceQueue({
          serviceId: paymentIntent.metadata?.serviceId || 'default',
          customerId: paymentIntent.metadata?.customerId,
          scheduledDate: paymentIntent.metadata?.scheduledDate,
          status: 'pending',
          paymentConfirmed: true,
        });
      } catch (queueError) {
        console.error('Error adding to service queue:', queueError);
        // Don't throw here, as payment was successful
        return;
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error; // Rethrow to be handled by the caller
  }
};

export const handlePaymentError = async (error: PaymentError): Promise<void> => {
  console.error('Payment error:', error);
  
  try {
    await axios.post('/api/payments/error', {
      error: {
        code: error.code,
        message: error.message,
        type: error.type,
      },
    });
  } catch (err) {
    console.error('Failed to log payment error:', err);
  }
};

export const addToServiceQueue = async (serviceRequest: ServiceRequest): Promise<void> => {
  try {
    const response = await axios.post('/api/payments/queue', serviceRequest);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to schedule service');
    }
  } catch (error) {
    console.error('Error adding to service queue:', error);
    throw new Error('Failed to schedule service');
  }
};

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000; // Maximum $10,000 SGD
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(amount);
};

export type { ServiceRequest } from '../types/service';
