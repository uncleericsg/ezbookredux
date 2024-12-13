import React, { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Box, Button, Typography } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setError } from '../store/slices/paymentSlice';
import axios from 'axios';
import PasswordCreationModal from './auth/PasswordCreationModal';
import { getStripe } from '../services/stripe';

interface PaymentFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const paymentState = useAppSelector(state => state.payment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error('Stripe has not been properly initialized');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create a PaymentIntent with metadata
      const response = await axios.post('/api/payments/create-payment-intent', {
        amount: paymentState.amount,
        currency: 'sgd',
        serviceId: paymentState.serviceId,
        customerId: paymentState.customerId,
        bookingId: paymentState.bookingId
      });

      const { clientSecret } = response.data;

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: paymentState.customerName,
              email: paymentState.customerEmail,
            },
          },
          metadata: {
            serviceId: paymentState.serviceId,
            customerId: paymentState.customerId,
            bookingId: paymentState.bookingId,
            scheduledDate: paymentState.scheduledDate,
            serviceName: paymentState.serviceName
          }
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment');
        onError?.(submitError.message || 'Payment failed');
        toast.error(submitError.message || 'Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Box sx={{ mb: 3 }}>
        <PaymentElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#374151',
                fontWeight: '500',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                '::placeholder': {
                  color: '#6B7280',
                },
                '.Input': {
                  backgroundColor: '#E5E7EB',
                  padding: '10px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                },
                '.Label': {
                  color: '#374151',
                  fontWeight: '500',
                },
              },
              invalid: {
                color: '#DC2626',
                iconColor: '#DC2626',
                '::placeholder': {
                  color: '#EF4444',
                },
              },
            },
            fields: {
              cardNumber: {
                style: { color: '#374151' },
              },
              expiryDate: {
                style: { color: '#374151' },
              },
              cvc: {
                style: { color: '#374151' },
              },
            },
            labels: 'floating',
          }}
        />
      </Box>
      
      {error && (
        <Typography 
          color="error" 
          sx={{ 
            mb: 2,
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        disabled={!stripe || !elements || isSubmitting}
        type="submit"
        fullWidth
        sx={{
          backgroundColor: '#FFD700',
          color: '#000',
          fontWeight: '600',
          padding: '12px',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#E6C200',
          },
          '&:disabled': {
            backgroundColor: '#E5E7EB',
            color: '#9CA3AF',
          },
        }}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </Button>

      {showPasswordModal && (
        <PasswordCreationModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={() => {}}
          email=""
        />
      )}
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const paymentState = useAppSelector(state => state.payment);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        if (!paymentState.amount || paymentState.amount <= 0) {
          return; // Silently return if amount is not set yet
        }

        // Create a PaymentIntent with metadata
        const response = await axios.post('/api/payments/create-payment-intent', {
          amount: paymentState.amount,
          currency: 'sgd',
          serviceId: paymentState.serviceId,
          customerId: paymentState.customerId,
          bookingId: paymentState.bookingId
        });

        const { clientSecret: secret } = response.data;
        if (!secret) {
          console.error('No client secret received');
          toast.error('Payment initialization failed');
          return;
        }
        
        setClientSecret(secret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        console.error('Failed to initialize payment:', err);
        toast.error(errorMessage);
        dispatch(setError(errorMessage));
        if (props.onError) {
          props.onError(errorMessage);
        }
      }
    };

    initializePayment();
  }, [paymentState.amount, props.onError]);

  if (!clientSecret) {
    return <Loader2 className="w-6 h-6 mx-auto animate-spin" />;
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      fontFamily: 'system-ui, sans-serif',
      fontWeightNormal: '400',
      borderRadius: '8px',
      colorBackground: '#ffffff',
      colorPrimary: '#0570de',
      colorPrimaryText: '#ffffff',
      spacingUnit: '4px',
    }
  };

  const options = {
    clientSecret,
    appearance,
    fonts: [{
      family: 'Mulish',
      src: 'local("Mulish")',
      weight: '400',
      style: 'normal',
    }],
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm;