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
  const { currentUser } = useAppSelector((state) => state.user);

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

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [paymentState, setPaymentState] = useState(initialPaymentState);
  const [stripePromise] = useState(getStripe);

  // Initialize payment on component mount
  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        
        // Log booking data to track customer info
        console.log('PaymentStep - Full booking data:', {
          customerInfo: bookingData.customerInfo,
          brands: bookingData.brands,
          issues: bookingData.issues,
          selectedService: bookingData.selectedService,
          bookingId: bookingData.bookingId
        });
        
        // Validate all required data
        console.log('Validating booking data:', {
          selectedService: bookingData.selectedService,
          bookingId: bookingData.bookingId,
          currentUser: currentUser?.id
        });

        if (!bookingData.selectedService) {
          throw new Error('Selected service is required');
        }

        const baseAmount = bookingData.selectedService.price;
        
        // Validate amount before proceeding
        if (!baseAmount || baseAmount <= 0) {
          console.error('Invalid amount:', baseAmount);
          throw new Error('Invalid amount. Service price is required.');
        }

        if (!bookingData.selectedService.id) {
          console.error('Missing service ID');
          throw new Error('Service ID is required.');
        }

        if (!bookingData.bookingId) {
          console.error('Missing booking ID');
          throw new Error('Booking ID is required.');
        }

        if (!currentUser?.id) {
          console.warn('No customer ID available');
        }

        console.log('Creating payment intent with:', {
          amount: baseAmount,
          serviceId: bookingData.selectedService.id,
          bookingId: bookingData.bookingId,
          customerId: currentUser?.id,
          tipAmount: 0,
          currency: 'sgd'
        });

        const intent = await createPaymentIntent(
          baseAmount,
          bookingData.selectedService.id,
          bookingData.bookingId,
          0, // Initialize with 0 tip
          'sgd',
          currentUser?.id
        );
        
        console.log('Payment intent created:', intent);
        setPaymentState((prev) => ({
          ...prev,
          clientSecret: intent.clientSecret,
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

    // Only initialize payment if we have all required data
    if (
      bookingData.selectedService?.price &&
      bookingData.selectedService?.id &&
      bookingData.bookingId
    ) {
      initializePayment();
    } else {
      console.error('Missing required booking data:', {
        price: bookingData.selectedService?.price,
        serviceId: bookingData.selectedService?.id,
        bookingId: bookingData.bookingId
      });
      toast.error('Missing required booking information');
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: 'Missing required booking information'
      }));
    }
  }, [bookingData.selectedService, bookingData.bookingId, currentUser?.id]);

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
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.SUCCESS,
      }));

      // Add to service queue
      await addToServiceQueue({
        serviceId: bookingData.selectedService.id,
        customerId: currentUser?.id,
        scheduledDate: bookingData.scheduledDateTime,
        status: 'pending',
        paymentConfirmed: true,
        tipAmount: paymentState.tipAmount,
        totalAmount: calculateTotalAmount(),
      });

      // Update payment status in Redux
      dispatch(setPaymentStatus('completed'));

      // Call onComplete with booking reference
      handlePaymentComplete(paymentIntent.id);
    } catch (error) {
      console.error('Error handling payment success:', error);
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: 'Failed to process payment completion',
      }));
    }
  }, [
    bookingData,
    currentUser,
    dispatch,
    handlePaymentComplete,
    paymentState.tipAmount,
    calculateTotalAmount,
  ]);

  if (isLoading || !paymentState.clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ImSpinner8 className="w-8 h-8 animate-spin text-gold-600" />
      </div>
    );
  }

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
          <div className="w-full sm:max-w-xl mx-auto">
            {/* Tip Selection */}
            <div className="bg-gray-800/90 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
              <div className="text-center sm:max-w-2xl mx-auto px-1 sm:px-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 mb-2">
                  <HiHeart className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Add a Tip</h3>
                <p className="text-gray-400 text-sm">Show your appreciation for great service!</p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-4 mb-4 mt-4">
                {[5, 10, 15, 20].map((amount) => (
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
                  amount={calculateTotalAmount()}
                  onSuccess={handlePaymentSuccess}
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
};

PaymentStep.displayName = 'PaymentStep';

export default PaymentStep;
