import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { FiCreditCard, FiLock } from 'react-icons/fi';

interface PaymentStepProps {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  amount: number;
  currency?: string;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  onPaymentSuccess,
  onPaymentError,
  amount,
  currency = 'SGD'
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
        toast.success('Payment successful!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FiCreditCard className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-white">Payment Details</h3>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <FiLock className="h-4 w-4" />
            <span className="text-sm">Secure Payment</span>
          </div>
        </div>

        <div className="mb-6">
          <PaymentElement />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>Amount to Pay:</span>
          <span className="font-medium text-white">
            {new Intl.NumberFormat('en-SG', {
              style: 'currency',
              currency: currency,
            }).format(amount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full py-2 px-4 rounded-lg font-medium
                   bg-gradient-to-r from-blue-500 to-blue-600
                   text-white shadow-lg
                   hover:shadow-blue-500/30
                   transform hover:scale-[1.02]
                   transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:transform-none"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export default PaymentStep;
