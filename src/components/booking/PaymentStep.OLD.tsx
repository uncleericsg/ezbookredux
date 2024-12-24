/*
 * @ai-protection - CRITICAL COMPONENT - DO NOT MODIFY WITHOUT REVIEW
 * 
 * This component is a core part of the payment processing system that handles:
 * 1. Stripe payment integration
 * 2. Booking summary display
 * 3. Payment state management
 * 4. Payment UI/UX
 * 
 * Critical Features:
 * - Payment processing flow
 * - Payment state management
 * - Error handling
 * - UI/UX consistency
 * 
 * Protected Aspects:
 * @ai-visual-protection: The payment UI design and styling must be preserved exactly as is
 * @ai-flow-protection: The payment flow and validation sequence must not be altered
 * @ai-state-protection: The payment state management pattern is optimized and stable
 * @ai-stripe-protection: The Stripe integration must follow security best practices
 * 
 * Integration Points:
 * - Stripe Elements
 * - Payment service
 * - Booking service
 * - Error handling system
 * 
 * Any modifications to this component could affect:
 * 1. Payment processing
 * 2. User experience
 * 3. Booking confirmation
 * 4. Financial transactions
 * 
 * Visual Elements Protected:
 * 1. Payment amount display (gold color, centered)
 * 2. Booking summary layout
 * 3. Payment form styling
 * 4. Error message display
 * 
 * State Management Protected:
 * 1. Payment initialization
 * 2. Payment processing
 * 3. Error handling
 * 4. Success confirmation
 * 
 * If changes are needed:
 * 1. Create a detailed proposal
 * 2. Test thoroughly in development
 * 3. Verify all payment flows
 * 4. Ensure PCI compliance
 * 5. Update documentation
 * 
 * Last Stable Update: December 2023
 * - Payment UI enhanced
 * - Stripe integration optimized
 * - Error handling improved
 */

// Types
export interface PaymentStepProps {
  bookingData: {
    brands: string[];
    issues: string[];
    customerInfo: {
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
      floorUnit: string;
      blockStreet: string;
      postalCode: string;
      condoName?: string;
      lobbyTower?: string;
      specialInstructions?: string;
    } | null;
    scheduledDateTime?: Date;
    scheduledTimeSlot?: string;
    selectedService?: {
      id: string;
      title: string;
      price: number;
      duration: string;
      description: string;
      usualPrice?: number;
      appointmentTypeId: string;
      isPremium?: boolean;
    };
    bookingId?: string;
    otherIssue?: string;
    isFirstTimeFlow?: boolean;
  };
  onComplete: (reference: string) => void;
  onBack: () => void;
}

export interface PaymentState {
  status: string;
  clientSecret: string | null;
  error: string | null;
  tipAmount: number;
}

// React and hooks
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// External libraries
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi2';
import { ImSpinner8 } from 'react-icons/im';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

// Components
import { PaymentForm } from '../payment/PaymentForm';
import { BookingSummary } from './BookingSummary';
import { BookingConfirmation } from './BookingConfirmation';
import { PaymentErrorBoundary } from '../payment/PaymentErrorBoundary';

// Redux
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setError, setPaymentStatus } from '../../store/slices/userSlice';
import { setCurrentBooking, updateBooking } from '../../store/slices/bookingSlice';

// Constants and Utils
import { PAYMENT_STATES } from '../../constants';
import { cn } from '../../lib/utils';

// Services
import {
  createPaymentIntent,
  addToServiceQueue,
} from '../../services/paymentService';
import { getStripe } from '../../services/stripe';

const initialPaymentState: PaymentState = {
  status: PAYMENT_STATES.INITIALIZING,
  clientSecret: null,
  error: null,
  tipAmount: 0
};

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
      dispatch(setError(null));
    }
  }, [dispatch, userError]);

  // Ensure booking data is in Redux store
  useEffect(() => {
    if (bookingData && (!currentBooking || currentBooking.id !== bookingData.bookingId)) {
      console.log('Setting current booking in Redux', bookingData);
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
  const [isLoading, setIsLoading] = useState(true);
  const [paymentState, setPaymentState] = useState(initialPaymentState);
  const [stripePromise] = useState(getStripe);

  // Log initial booking data
  useEffect(() => {
    console.log('PaymentStep mounted with booking data:', {
      customerInfo: bookingData.customerInfo,
      bookingId: bookingData.bookingId,
      selectedService: bookingData.selectedService,
      scheduledDateTime: bookingData.scheduledDateTime,
      scheduledTimeSlot: bookingData.scheduledTimeSlot
    });
  }, [bookingData]);

  // Validate booking data before initializing payment
  useEffect(() => {
    const validateBookingData = () => {
      if (!bookingData) {
        throw new Error('Booking data is required');
      }

      if (!bookingData.selectedService) {
        throw new Error('Selected service is required');
      }

      if (!bookingData.selectedService.id) {
        throw new Error('Service ID is required');
      }

      if (!bookingData.selectedService.price || bookingData.selectedService.price <= 0) {
        throw new Error('Invalid service price');
      }

      if (!bookingData.bookingId) {
        throw new Error('Booking ID is required');
      }

      return {
        amount: bookingData.selectedService.price,
        serviceId: bookingData.selectedService.id,
        bookingId: bookingData.bookingId
      };
    };

    try {
      const validatedData = validateBookingData();
      console.log('Validated booking data:', validatedData);
      
      // Initialize payment only if we have valid data
      initializePayment(validatedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid booking data';
      console.error(errorMessage, {
        price: bookingData?.selectedService?.price,
        serviceId: bookingData?.selectedService?.id,
        bookingId: bookingData?.bookingId
      });
      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: errorMessage
      }));
      toast.error(errorMessage);
    }
  }, [bookingData]);

  const initializePayment = async (validatedData: { amount: number; serviceId: string; bookingId: string }) => {
    try {
      setIsLoading(true);
      
      console.log('Creating payment intent with:', {
        amount: validatedData.amount,
        serviceId: validatedData.serviceId,
        bookingId: validatedData.bookingId,
        customerId: currentUser?.id,
        tipAmount: 0,
        currency: 'sgd'
      });

      const intent = await createPaymentIntent(
        validatedData.amount,
        validatedData.serviceId,
        validatedData.bookingId,
        0,
        'sgd',
        currentUser?.id
      );
      
      console.log('Payment intent created:', intent);
      setPaymentState((prev) => ({
        ...prev,
        clientSecret: intent.clientSecret,
        status: PAYMENT_STATES.READY
      }));
    } catch (error) {
      console.error('Error initializing payment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      toast.error(errorMessage);
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tip changes
  const handleTipChange = useCallback((amount: number) => {
    setPaymentState((prev) => ({
      ...prev,
      tipAmount: amount
    }));
  }, []);

  // Calculate total amount including tip
  const calculateTotalAmount = useCallback(() => {
    const baseAmount = bookingData.selectedService?.price || 0;
    return baseAmount + paymentState.tipAmount;
  }, [bookingData.selectedService?.price, paymentState.tipAmount]);

  // Handlers
  const handlePaymentComplete = useCallback(async (reference: string) => {
    onComplete?.(reference);
  }, [onComplete]);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  const handlePaymentSuccess = useCallback(async (paymentIntent: any) => {
    try {
      console.log('Payment success handler started', { paymentIntent });
      
      // Update payment status to processing
      await dispatch(setPaymentStatus('processing'));
      
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.SUCCESS,
      }));

      // Add to service queue
      try {
        await addToServiceQueue({
          serviceId: bookingData.selectedService?.id || '',
          customerId: currentUser?.id,
          scheduledDate: bookingData.scheduledDateTime,
          status: 'pending',
          paymentConfirmed: true,
          tipAmount: paymentState.tipAmount,
          totalAmount: calculateTotalAmount(),
        });
      } catch (queueError) {
        console.error('Error adding to service queue:', queueError);
        // Continue with the flow even if queue fails
      }

      // Update booking status in Redux
      if (bookingData.bookingId) {
        try {
          await dispatch(updateBooking({
            id: bookingData.bookingId,
            status: 'Confirmed',
            paymentStatus: 'Completed',
            paymentId: paymentIntent.id,
            updatedAt: new Date().toISOString()
          }));
        } catch (updateError) {
          console.error('Error updating booking:', updateError);
          // Continue with the flow even if update fails
        }
      }

      // Update Redux store payment status
      try {
        await dispatch(setPaymentStatus('success'));
      } catch (statusError) {
        console.error('Error updating payment status:', statusError);
        // Continue with the flow even if status update fails
      }

      // Generate a unique booking reference
      const bookingReference = bookingData.bookingId || paymentIntent.id;
      
      console.log('Payment completed successfully. Booking data:', {
        bookingReference,
        serviceType: bookingData.selectedService?.title,
        date: bookingData.scheduledDateTime,
        timeSlot: bookingData.scheduledTimeSlot
      });

      // Call onComplete with payment intent ID
      await handlePaymentComplete(paymentIntent.id);

      // Only navigate if we're not in FirstTimeBookingFlow
      if (!bookingData.isFirstTimeFlow) {
        navigate(`/booking/confirmation/${bookingReference}`, {
          state: { 
            booking: {
              id: bookingReference,
              serviceType: bookingData.selectedService?.title || '',
              date: bookingData.scheduledDateTime ? format(bookingData.scheduledDateTime, 'PP') : '',
              time: bookingData.scheduledTimeSlot || '',
              status: 'Upcoming',
              amount: calculateTotalAmount(),
              paymentMethod: 'Credit Card',
              customerInfo: bookingData.customerInfo || null,
              address: bookingData.customerInfo ? 
                `${bookingData.customerInfo.blockStreet}, ${bookingData.customerInfo.floorUnit}, Singapore ${bookingData.customerInfo.postalCode}` :
                ''
            }
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Error in payment success handler:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed error:', { error, errorMessage });
      
      dispatch(setPaymentStatus('error'));
      toast.error('Payment completed but booking confirmation failed. Please contact support with reference: ' + (bookingData.bookingId || paymentIntent?.id));
      
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: 'Failed to process payment completion: ' + errorMessage,
      }));
    }
  }, [
    bookingData,
    currentUser?.id,
    dispatch,
    handlePaymentComplete,
    paymentState.tipAmount,
    calculateTotalAmount,
    navigate
  ]);

  // Render loading state
  if (isLoading || !paymentState.clientSecret) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="p-8 rounded-lg bg-gray-800/50 border border-gray-700/70 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <ImSpinner8 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-300">Initializing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (paymentState.status === PAYMENT_STATES.ERROR) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="p-8 rounded-lg bg-gray-800/50 border border-gray-700/70 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4 text-center">
            <HiHeart className="w-12 h-12 text-red-500" />
            <h3 className="text-xl font-semibold text-red-500">Payment Error</h3>
            <p className="text-gray-300">{paymentState.error}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render payment form when ready
  if (paymentState.status === PAYMENT_STATES.READY && paymentState.clientSecret) {
    return (
      <PaymentErrorBoundary>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl mx-auto py-1 px-0.5 sm:py-8 sm:px-4"
        >
          {/* Booking Summary */}
          <div className="mb-2 sm:mb-8">
            <BookingSummary
              customerInfo={bookingData.customerInfo}
              selectedDate={bookingData.scheduledDateTime}
              selectedTimeSlot={bookingData.scheduledTimeSlot}
              service={bookingData.selectedService}
              brands={bookingData.brands}
              issues={bookingData.issues}
            />
          </div>

          {paymentState.status === PAYMENT_STATES.SUCCESS ? (
            <BookingConfirmation
              reference={paymentState.clientSecret}
              onComplete={handlePaymentComplete}
            />
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              {/* Tip Selection */}
              <div className="bg-gray-800/90 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
                <div className="text-center mx-auto px-1 sm:px-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 mb-2">
                    <HiHeart className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Add a Tip</h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Motivate our service teams to go above and beyond!
                  </p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-4 mb-4 mt-4">
                  {[5, 10, 15, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleTipChange(amount)}
                      className={cn(
                        'px-2 sm:px-3 py-1.5 rounded text-sm font-medium transition-all duration-200',
                        paymentState.tipAmount === amount
                          ? 'bg-gray-700 text-pink-400 border border-pink-400/50'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                      )}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                {paymentState.tipAmount > 0 && (
                  <div className="mt-4 text-center text-sm text-gray-300">
                    <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
                      <span>Service: ${bookingData.selectedService?.price || 0}</span>
                      <span>Tip: ${paymentState.tipAmount}</span>
                      <span className="font-medium text-white">Total: ${calculateTotalAmount()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Elements */}
              <div className="bg-gray-800/90 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
                {/* Total Amount Display */}
                <div className="text-center mb-4 sm:mb-8">
                  <h3 className="text-gray-400 mb-2">Amount to Pay</h3>
                  <p className="text-3xl font-semibold text-yellow-400">
                    ${calculateTotalAmount().toFixed(2)}
                  </p>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: paymentState.clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#FACC15',
                        colorBackground: '#1E1E1E',
                        colorText: '#D4D4D4',
                        colorDanger: '#ef4444',
                        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '6px',
                      },
                      rules: {
                        '.Input': {
                          backgroundColor: '#2D2D2D',
                          border: '1px solid #404040',
                        },
                        '.Input:focus': {
                          border: '1px solid #FACC15',
                        },
                        '.Label': {
                          color: '#A3A3A3',
                        },
                      },
                    },
                  }}
                >
                  <PaymentForm
                    clientSecret={paymentState.clientSecret || ''}
                    amount={calculateTotalAmount()}
                    onComplete={handlePaymentSuccess}
                    onError={(error) => {
                      dispatch(setError(error.message));
                    }}
                  />
                </Elements>
              </div>

              {/* Payment Form */}
              <div className="grid grid-cols-1 gap-2 sm:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  {paymentState.error && (
                    <div className="p-2 sm:p-4 bg-red-50 text-red-700 rounded-md">
                      {paymentState.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              disabled={paymentState.status === PAYMENT_STATES.PROCESSING}
            >
              Back
            </button>
          </div>
        </motion.div>
      </PaymentErrorBoundary>
    );
  }

  return (
    <PaymentErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="p-8 rounded-lg bg-gray-800/50 border border-gray-700/70 backdrop-blur-sm">
          <BookingSummary bookingData={bookingData} />
        </div>

        <div className="p-8 rounded-lg bg-gray-800/50 border border-gray-700/70 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <ImSpinner8 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-300">Preparing payment form...</p>
          </div>
        </div>
      </motion.div>
    </PaymentErrorBoundary>
  );
};

PaymentStep.displayName = 'PaymentStep';

export default PaymentStep;
