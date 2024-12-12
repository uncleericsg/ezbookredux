import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../contexts/PaymentContext';
import { Box, Typography, Button, Container, Alert, CircularProgress } from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { getStripe } from '../../services/stripe';
import { handlePaymentSuccess } from '../../services/paymentService';
import { toast } from 'sonner';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePayment();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        const clientSecret = searchParams.get('payment_intent_client_secret');
        const paymentIntentId = searchParams.get('payment_intent');
        const redirectStatus = searchParams.get('redirect_status');

        console.log('URL Parameters:', {
          clientSecret: clientSecret ? 'present' : 'missing',
          paymentIntentId,
          redirectStatus
        });

        if (!clientSecret || !paymentIntentId) {
          setError(
            'No payment information found. This could be because:\n' +
            '• You accessed this page directly\n' +
            '• The payment session has expired\n' +
            '• The payment was not completed successfully'
          );
          return;
        }

        const stripe = await getStripe();
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }

        // Retrieve payment intent
        const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(clientSecret);
        
        if (retrieveError) {
          console.error('Error retrieving payment intent:', retrieveError);
          throw new Error(retrieveError.message);
        }

        if (!paymentIntent) {
          throw new Error('Payment information not found');
        }

        console.log('Payment intent retrieved:', paymentIntent);

        if (paymentIntent.status === 'succeeded') {
          try {
            await handlePaymentSuccess(paymentIntent);
            setIsSuccess(true);
            setPaymentDetails(paymentIntent);
          } catch (err) {
            console.error('Error handling payment success:', err);
            // Still show success but with a warning
            setIsSuccess(true);
            setPaymentDetails(paymentIntent);
            toast.error('Payment successful, but there was an error updating your booking. Our team will contact you shortly.');
          }
        } else {
          throw new Error(`Payment status is ${paymentIntent.status}`);
        }
      } catch (err) {
        console.error('Payment confirmation error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during payment confirmation');
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Confirming your payment...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturn}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <CheckCircle size={64} color="green" />
        <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your payment. Your service has been scheduled.
        </Typography>
        {paymentDetails && (
          <Box sx={{ mb: 3, width: '100%' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Amount paid: ${(paymentDetails.amount / 100).toFixed(2)} SGD
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Transaction ID: {paymentDetails.id}
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleReturn}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentSuccess;
