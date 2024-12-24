import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentDetails, PaymentError, TransactionRecord } from '../types/payment';
import { ServiceRequest } from '../types/service';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { ApiError } from '../utils/apiErrors';

// Initialize Stripe instance
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
    console.log('Creating payment intent with:', { 
      amount, 
      serviceId, 
      bookingId, 
      tipAmount, 
      currency, 
      customerId 
    });

    const baseUrl = 'https://localhost:3001';
    console.log('Making request to:', `${baseUrl}/api/payments/create-payment-intent`);

    try {
      const response = await axios.post(`${baseUrl}/api/payments/create-payment-intent`, {
        amount: amount, // Server expects amount in cents
        tipAmount: Math.round(tipAmount * 100), // Convert tip to cents
        currency,
        serviceId,
        customerId,
        bookingId
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.data || !response.data.clientSecret) {
        console.error('Invalid response from payment server:', response.data);
        throw new Error('Invalid response from payment server');
      }

      console.log('Payment intent created successfully:', response.data);

      return {
        clientSecret: response.data.clientSecret,
        id: response.data.id
      };
    } catch (networkError) {
      if (axios.isAxiosError(networkError)) {
        if (networkError.code === 'ECONNREFUSED') {
          console.error('Could not connect to payment server. Is it running?');
          throw new Error('Payment server is not running');
        }
        if (networkError.code === 'ECONNABORTED') {
          console.error('Request timed out');
          throw new Error('Payment request timed out');
        }
        console.error('Network error details:', {
          status: networkError.response?.status,
          data: networkError.response?.data,
          message: networkError.message,
          code: networkError.code
        });
        throw new Error(`Payment server error: ${networkError.message}`);
      }
      throw networkError;
    }
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw error;
  }
};

export const handlePaymentSuccess = async (paymentIntent: any): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'succeeded' })
      .eq('payment_intent_id', paymentIntent.id);

    if (error) throw error;

    console.log('Payment success recorded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw new ApiError('Failed to update payment status', 500);
  }
};

export const handlePaymentError = async (error: PaymentError): Promise<void> => {
  console.error('Payment error:', error);
  const { data, error: dbError } = await supabase
    .from('payments')
    .update({ status: 'failed', error_message: error.message })
    .eq('payment_intent_id', error.paymentIntentId);

  if (dbError) {
    console.error('Error updating payment status:', dbError);
  }
};

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD'
  }).format(amount);
};

export const getPaymentReceipt = async (paymentIntentId: string): Promise<string> => {
  try {
    const response = await axios.get(`/api/payments/${paymentIntentId}/generate-receipt`);
    return response.data.receiptUrl;
  } catch (error) {
    console.error('Error getting receipt:', error);
    throw new Error('Failed to get receipt');
  }
};

interface PaymentOptions {
  bookingId: string;
  customerId?: string;
  serviceId: string;
  tipAmount?: number;
  currency?: string;
}

interface PaymentReceipt {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  paymentIntentId: string;
  bookingId: string;
  customerId?: string;
  serviceId: string;
  tipAmount: number;
}

interface ServiceRequest {
  serviceId: string;
  customerId?: string | null;
  scheduledDate?: Date | null;
  status?: string;
  paymentConfirmed?: boolean;
  tipAmount?: number;
  totalAmount?: number;
}

export const addToServiceQueue = async (serviceRequest: ServiceRequest): Promise<void> => {
  try {
    console.log('Adding to service queue:', serviceRequest);
    
    const { data, error } = await supabase
      .from('service_queue')
      .insert([{
        service_id: serviceRequest.serviceId,
        customer_id: serviceRequest.customerId,
        scheduled_date: serviceRequest.scheduledDate,
        status: serviceRequest.status || 'pending',
        payment_confirmed: serviceRequest.paymentConfirmed || false,
        // created_at will be set by default values
      }]);

    if (error) {
      console.error('Error adding to service queue:', error);
      throw error;
    }

    console.log('Successfully added to service queue:', data);
  } catch (error) {
    console.error('Error in addToServiceQueue:', error);
    // Don't throw error since this is not critical for payment flow
    console.warn('Continuing despite service queue error');
  }
};

export interface PaymentService {
  createPayment: (amount: number, options: PaymentOptions) => Promise<PaymentReceipt>;
  updatePaymentStatus: (paymentIntentId: string, status: string) => Promise<void>;
  getPaymentByIntent: (paymentIntentId: string) => Promise<PaymentReceipt | null>;
  updatePaymentIntent: (paymentId: string, paymentIntentId: string) => Promise<void>;
}

export const paymentService: PaymentService = {
  createPayment: async (amount: number, options: PaymentOptions): Promise<PaymentReceipt> => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            amount,
            currency: options.currency || 'sgd',
            status: 'pending',
            customer_id: options.customerId || null,
            service_id: options.serviceId,
            booking_id: options.bookingId,
            // created_at and updated_at will be set by default values
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        throw error;
      }

      return {
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        customerId: data.customer_id,
        serviceId: data.service_id,
        bookingId: data.booking_id,
        tipAmount: 0,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  },

  updatePaymentStatus: async (paymentIntentId: string, status: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status })
        .eq('payment_intent_id', paymentIntentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  getPaymentByIntent: async (paymentIntentId: string): Promise<PaymentReceipt | null> => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_intent_id', paymentIntentId)
        .single();

      if (error) throw error;

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        createdAt: new Date(data.created_at),
        paymentIntentId: data.payment_intent_id,
        bookingId: data.booking_id,
        customerId: data.customer_id,
        serviceId: data.service_id,
        tipAmount: data.tip_amount
      };
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  updatePaymentIntent: async (paymentId: string, paymentIntentId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ payment_intent_id: paymentIntentId })
        .eq('id', paymentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment intent:', error);
      throw error;
    }
  }
};

export type { ServiceRequest } from '../types/service';
