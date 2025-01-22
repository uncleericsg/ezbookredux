import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import cn from '@utils/cn';

interface PaymentFormProps {
  clientSecret: string;
  onComplete: (paymentIntent: any) => void;
  amount: number;
  onError: (error: any) => void;
}

export const PaymentForm: FC<PaymentFormProps> = ({
  clientSecret,
  onComplete,
  amount,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);

  if (!stripe || !elements) {
    return null;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !isElementReady) {
      console.error('Payment form not ready');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Starting payment submission...');
      
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent) {
        console.log('Payment successful:', paymentIntent);
        onComplete(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError(error);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-2 sm:p-6">
        <PaymentElement 
          id="payment-element" 
          onReady={() => setIsElementReady(true)}
        />
        
        <button
          type="submit"
          disabled={isProcessing || !isElementReady}
          className={cn(
            "mt-6 w-full py-3 px-4 rounded-lg font-medium",
            "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600",
            "text-gray-900 shadow-lg",
            "hover:shadow-yellow-400/30",
            "transform hover:scale-[1.02]",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "disabled:transform-none",
            "flex items-center justify-center gap-2"
          )}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiCreditCard className="h-5 w-5" />
              <span>Pay Now ${Number(amount).toFixed(2)}</span>
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center text-sm text-gray-400">
          <FiLock className="w-4 h-4 mr-1" />
          Secure payment powered by Stripe
        </div>
      </div>
    </form>
  );
};

PaymentForm.displayName = 'PaymentForm';

export default PaymentForm;
