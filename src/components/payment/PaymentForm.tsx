import React from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { FiCreditCard, FiLock } from 'react-icons/fi';

interface PaymentFormProps {
  clientSecret: string;
  onComplete: (paymentIntent: any) => void;
  amount: number;
  onError: (error: any) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  onComplete,
  amount,
  onError
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
        onComplete(paymentIntent);
        toast.success('Payment successful!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError(error);
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
              currency: 'SGD',
            }).format(amount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full py-3 px-4 rounded-lg font-medium
                   bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                   text-gray-900 shadow-lg
                   hover:shadow-yellow-400/30
                   transform hover:scale-[1.02]
                   transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:transform-none
                   flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiLock className="h-5 w-5" />
              <span>Pay Securely</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

PaymentForm.displayName = 'PaymentForm';

export default PaymentForm;
