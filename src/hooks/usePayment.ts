import { useState } from 'react';
import { createPaymentIntent, confirmPayment } from '@services/stripe';
import type { 
  CreatePaymentIntentParams,
  PaymentIntentResponse,
  PaymentError 
} from '@shared/types/payment';
import { logger } from '@/utils/logger';

interface UsePaymentOptions {
  onSuccess?: (response: PaymentIntentResponse) => void;
  onError?: (error: PaymentError) => void;
}

export const usePayment = (options?: UsePaymentOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  const processPayment = async (params: CreatePaymentIntentParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await createPaymentIntent(params);
      
      if (response.error) {
        setError(response.error);
        options?.onError?.(response.error);
        return null;
      }

      if (!response.data) {
        throw new Error('No payment intent data received');
      }

      const confirmResponse = await confirmPayment(response.data.clientSecret);
      
      if (confirmResponse.error) {
        setError(confirmResponse.error);
        options?.onError?.(confirmResponse.error);
        return null;
      }

      if (!confirmResponse.data) {
        throw new Error('Payment confirmation failed');
      }

      options?.onSuccess?.(confirmResponse.data);
      return confirmResponse.data;
    } catch (err) {
      const paymentError: PaymentError = {
        message: err instanceof Error ? err.message : 'Payment processing failed',
        code: 'PAYMENT_ERROR'
      };
      setError(paymentError);
      options?.onError?.(paymentError);
      logger.error('Payment processing failed', { error: err });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading,
    error,
  };
};