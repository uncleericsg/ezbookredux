import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentDetails, PaymentError, TransactionRecord } from '../types/payment';
import { ServiceRequest } from '../types/service';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { ApiError } from '../utils/apiErrors';
import { createBooking as createSupabaseBooking } from './supabaseBookingService';
import type { BookingDetails } from './supabaseBookingService';

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

export const createBooking = createSupabaseBooking;

// Get API URL from environment
const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn('VITE_API_URL not set, falling back to default');
    // In development, use the local network IP instead of localhost for mobile testing
    return process.env.NODE_ENV === 'development' 
      ? 'http://192.168.4.118:3001'  // Use HTTP in development
      : window.location.origin;
  }
  return apiUrl;
};

export const createPaymentIntent = async (
  amount: number,
  serviceId: string,
  bookingId: string,
  tipAmount: number = 0,
  currency: string = 'sgd',
  customerId?: string,
): Promise<{ clientSecret: string; id: string }> => {
  console.log('Creating payment intent with:', { 
    amount, 
    serviceId, 
    bookingId, 
    tipAmount, 
    currency, 
    customerId 
  });

  const baseUrl = getApiBaseUrl();
  console.log('Making request to:', `${baseUrl}/api/payments/create-payment-intent`);

  try {
    // Create custom axios instance
    const axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for debugging
    axiosInstance.interceptors.request.use(request => {
      console.log('Request details:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.data
      });
      return request;
    });

    // Configure axios to not throw on non-2xx status codes
    axiosInstance.interceptors.response.use(
      response => {
        console.log('Response received:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        return response;
      },
      error => {
        console.error('Axios error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        throw error;
      }
    );

    const response = await axiosInstance.post('/api/payments/create-payment-intent', {
      amount: Math.round(amount * 100), // Convert to cents
      tipAmount: Math.round(tipAmount * 100), // Convert tip to cents
      currency,
      serviceId,
      customerId,
      bookingId
    });

    if (!response.data || !response.data.clientSecret) {
      console.error('Invalid response from payment server:', response.data);
      throw new Error('Invalid response from payment server');
    }

    console.log('Payment intent created successfully:', response.data);

    return {
      clientSecret: response.data.clientSecret,
      id: response.data.intentId
    };

  } catch (error) {
    console.error('Network error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    throw new Error(`Payment server error: ${error.message}`);
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
    const baseUrl = getApiBaseUrl();
    const response = await axios.get(`${baseUrl}/api/payments/${paymentIntentId}/generate-receipt`);
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

export interface PaymentDetails {
  id: string;  // UUID
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  booking_id: string;  // UUID
  customer_id?: string | null;  // UUID
  service_id: string;  // UUID
  tip_amount?: number;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

export interface TransactionRecord {
  id: string;
  amount: number;
  status: string;
  created_at: string;
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
  createPayment: (amount: number, options: PaymentOptions) => Promise<PaymentDetails>;
  updatePaymentStatus: (paymentIntentId: string, status: string) => Promise<void>;
  getPaymentByIntent: (paymentIntentId: string) => Promise<PaymentDetails | null>;
  updatePaymentIntent: (paymentId: string, paymentIntentId: string) => Promise<void>;
}

export const paymentService: PaymentService = {
  createPayment: async (amount: number, options: PaymentOptions): Promise<PaymentDetails> => {
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

  getPaymentByIntent: async (paymentIntentId: string): Promise<PaymentDetails | null> => {
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
