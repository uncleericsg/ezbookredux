import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';
import { HiHeart } from 'react-icons/hi2';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Components
import { BookingSummary } from '@components/booking/BookingSummary';
import { BookingConfirmation } from '@components/booking/BookingConfirmation';
import EnhancedErrorBoundary from '@components/EnhancedErrorBoundary';

// Redux
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setError, setPaymentStatus } from '@store/slices/userSlice';
import { setCurrentBooking, updateBooking } from '@store/slices/bookingSlice';

// Types
import type {
  PaymentStepProps,
  PaymentStepContentProps,
  PaymentState,
  PaymentStatus,
  PAYMENT_STATES
} from '@shared/types/payment';

// Services
import { getStripe } from '@services/stripe';
import { createPaymentIntent, addToServiceQueue } from '@services/paymentService';
import { createBooking } from '@services/supabaseBookingService';
import { getServiceByAppointmentType } from '@services/serviceUtils';

const initialPaymentState: PaymentState = {
  status: PAYMENT_STATES.INITIALIZING,
  clientSecret: null,
  error: null,
  tipAmount: 0
};

const logPaymentEvent = (event: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[PaymentStep ${timestamp}] ${event}`, data ? data : '');
};

const calculateTotalAmount = (baseAmount: number, tipAmount = 0): number => {
  return baseAmount + tipAmount;
};

// Main Payment Step Component
const PaymentStep: React.FC<PaymentStepProps> = ({
  bookingData,
  onComplete,
  onBack,
}: PaymentStepProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, error: userError } = useAppSelector((state) => state.user);
  const { currentBooking } = useAppSelector((state) => state.booking);

  // Clear any existing errors on mount
  useEffect(() => {
    if (userError) {
      logPaymentEvent('Clearing existing user error');
      dispatch(setError(null));
    }
  }, [dispatch, userError]);

  // Ensure booking data is in Redux store
  useEffect(() => {
    if (bookingData && (!currentBooking || currentBooking.id !== bookingData.bookingId)) {
      logPaymentEvent('Setting current booking in Redux', bookingData);
      dispatch(setCurrentBooking({
        id: bookingData.bookingId,
        serviceType: bookingData.selectedService?.title || '',
        date: bookingData.scheduledDateTime ? format(bookingData.scheduledDateTime, 'PP') : '',
        time: bookingData.scheduledTimeSlot || '',
        status: 'Pending',
        amount: bookingData.selectedService?.price || 0,
        customerInfo: bookingData.customerInfo || null
      }));
    }
  }, [bookingData, currentBooking, dispatch]);

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>(initialPaymentState);
  const [stripePromise] = useState(getStripe);

  // Component mount logging
  useEffect(() => {
    logPaymentEvent('Component mounted', {
      hasClientSecret: !!paymentState.clientSecret,
      bookingId: bookingData?.bookingId,
      serviceId: bookingData?.selectedService?.id,
      price: bookingData?.selectedService?.price,
      status: paymentState.status
    });

    return () => {
      logPaymentEvent('Component unmounting');
    };
  }, []);

  // Prevent duplicate payment intents
  const paymentInitializedRef = useRef(false);

  useEffect(() => {
    if (paymentState.clientSecret || paymentInitializedRef.current) {
      logPaymentEvent('Payment intent exists or initialization in progress', {
        hasClientSecret: !!paymentState.clientSecret,
        isInitialized: paymentInitializedRef.current
      });
      return;
    }

    if (!bookingData?.selectedService?.id || !bookingData?.bookingId) {
      logPaymentEvent('Missing required booking data', {
        serviceId: bookingData?.selectedService?.id,
        bookingId: bookingData?.bookingId
      });
      return;
    }

    const initializePayment = async () => {
      try {
        paymentInitializedRef.current = true;
        setIsLoading(true);

        // Get service details
        const serviceDetails = await getServiceByAppointmentType(bookingData.selectedService.id);
        if (!serviceDetails) {
          throw new Error('Service not found');
        }

        // Create or get booking
        const bookingRef = await createBooking({
          ...bookingData,
          serviceId: serviceDetails.id,
          userId: currentUser?.id
        });

        if (!bookingRef) {
          throw new Error('Failed to create booking');
        }

        // Create payment intent
        const { clientSecret } = await createPaymentIntent({
          bookingId: bookingRef.id,
          serviceId: serviceDetails.id,
          amount: bookingData.selectedService.price,
          customerEmail: bookingData.customerInfo?.email || '',
          metadata: {
            bookingId: bookingRef.id,
            serviceId: serviceDetails.id
          }
        });

        setPaymentState(prev => ({
          ...prev,
          status: PAYMENT_STATES.READY,
          clientSecret
        }));

        logPaymentEvent('Payment initialized', {
          bookingId: bookingRef.id,
          serviceId: serviceDetails.id
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize payment';
        logPaymentEvent('Payment initialization failed', { error: errorMessage });
        setPaymentState(prev => ({
          ...prev,
          status: PAYMENT_STATES.FAILED,
          error: errorMessage
        }));
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [bookingData, currentUser, paymentState.clientSecret]);

  const handlePaymentSuccess = useCallback((reference: string) => {
    logPaymentEvent('Payment successful', { reference });
    dispatch(setPaymentStatus('succeeded'));
    onComplete(reference);
  }, [dispatch, onComplete]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ImSpinner8 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  if (paymentState.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-4">
          <span className="text-lg">Payment initialization failed</span>
        </div>
        <p className="text-gray-600 mb-6">{paymentState.error}</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!paymentState.clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: paymentState.clientSecret }}>
      <EnhancedErrorBoundary>
        <PaymentStepContent
          bookingData={bookingData}
          paymentState={paymentState}
          setPaymentState={setPaymentState}
          onBack={onBack}
          onSuccess={handlePaymentSuccess}
        />
      </EnhancedErrorBoundary>
    </Elements>
  );
};

const PaymentStepContent: React.FC<PaymentStepContentProps> = ({
  bookingData,
  paymentState,
  setPaymentState,
  onBack,
  onSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded');
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
        redirect: 'if_required'
      });

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent.status === 'succeeded') {
        await addToServiceQueue(bookingData.bookingId);
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.FAILED,
        error: errorMessage
      }));
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BookingSummary bookingData={bookingData} />
      
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PaymentElement />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
          >
            {isProcessing ? (
              <>
                <ImSpinner8 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentStep;
