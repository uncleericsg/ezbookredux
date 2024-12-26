import { useState } from 'react';
import { createPaymentIntent, confirmPayment } from '@services/stripe';
import { toast } from 'sonner';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (amount: number, options?: {
    currency?: string;
    description?: string;
    metadata?: Record<string, string>;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const { clientSecret } = await createPaymentIntent(amount, options?.currency || 'sgd', {
        description: options?.description,
        metadata: options?.metadata
      });

      const result = await confirmPayment(clientSecret);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    processPayment
  };
};