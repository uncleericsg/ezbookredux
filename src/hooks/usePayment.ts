import { useState, useCallback } from 'react';
import type { 
  PaymentError, 
  PaymentIntentResponse,
  CreatePaymentIntentParams,
  ApiErrorCode 
} from '@shared/types/payment';
import { logger } from '@server/utils/logger';

interface UsePaymentOptions {
  onSuccess?: (response: PaymentIntentResponse) => void;
  onError?: (error: PaymentError) => void;
}

interface UsePaymentReturn {
  processPayment: (params: CreatePaymentIntentParams) => Promise<void>;
  loading: boolean;
  error: PaymentError | null;
}

interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
}

// Type guard for API error response
const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiErrorResponse).code === 'string' &&
    typeof (error as ApiErrorResponse).message === 'string'
  );
};

/**
 * Hook to handle payment processing
 */
export const usePayment = (options: UsePaymentOptions = {}): UsePaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  const processPayment = useCallback(async (params: CreatePaymentIntentParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          code: errorData.code || 'PAYMENT_ERROR',
          message: errorData.message || 'Payment processing failed'
        };
      }

      const data: PaymentIntentResponse = await response.json();
      
      logger.info('Payment intent created', { 
        paymentIntentId: data.paymentIntentId,
        amount: data.amount,
        currency: data.currency
      });

      options.onSuccess?.(data);
    } catch (err: unknown) {
      const paymentError: PaymentError = {
        code: isApiErrorResponse(err) ? err.code : 'PAYMENT_ERROR',
        message: isApiErrorResponse(err) ? err.message : 'An unexpected error occurred'
      };
      
      logger.error('Payment processing failed', { 
        error: isApiErrorResponse(err) ? err : 'Unknown error'
      });
      
      setError(paymentError);
      options.onError?.(paymentError);
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    processPayment,
    loading,
    error
  };
};
