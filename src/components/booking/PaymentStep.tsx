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

interface PaymentState {
  status: string;
  clientSecret: string | null;
  error: string | null;
  tipAmount: number;
}

// React and hooks
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// External libraries
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { HiHeart } from 'react-icons/hi2';
import { ImSpinner8 } from 'react-icons/im';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

// Components
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
  createBooking
} from '../../services/paymentService';
import { getStripe } from '../../services/stripe';
import { getServiceByAppointmentType } from '../../services/serviceUtils';

const initialPaymentState: PaymentState = {
  status: PAYMENT_STATES.INITIALIZING,
  clientSecret: null,
  error: null,
  tipAmount: 0
};

const logPaymentEvent = (event: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[PaymentStep ${timestamp}] ${event}`, data ? data : '');
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
  const [isLoading, setIsLoading] = useState(false);  // Start with false to prevent UI flicker
  const [paymentState, setPaymentState] = useState(initialPaymentState);
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

  // Prevent duplicate payment intents with ref tracking
  const paymentInitializedRef = useRef(false);

  useEffect(() => {
    // Guard clauses to prevent unnecessary processing
    if (paymentState.clientSecret || paymentInitializedRef.current) {
      logPaymentEvent('Payment intent already exists or initialization in progress, skipping', {
        hasClientSecret: !!paymentState.clientSecret,
        isInitialized: paymentInitializedRef.current
      });
      return;
    }

    if (!bookingData?.selectedService?.id || !bookingData?.bookingId) {
      logPaymentEvent('Missing required booking data, skipping payment initialization', {
        serviceId: bookingData?.selectedService?.id,
        bookingId: bookingData?.bookingId
      });
      return;
    }

    const initializePayment = async () => {
      try {
        paymentInitializedRef.current = true;  // Mark initialization as in progress
        setIsLoading(true);

        try {
          // Get the actual service UUID from Supabase
          const serviceDetails = await getServiceByAppointmentType(bookingData.selectedService.id);
          
          if (!serviceDetails) {
            throw new Error('Service not found');
          }
          
          // First, create or get Supabase booking
          const bookingDetails: BookingDetails = {
            service_id: serviceDetails.id, // Use the UUID from Supabase
            service_title: bookingData.selectedService?.title || '',
            service_price: bookingData.selectedService?.price || 0,
            service_duration: bookingData.selectedService?.duration || '',
            service_description: bookingData.selectedService?.description,
            
            // Customer information
            customer_info: {
              first_name: bookingData.customerInfo?.firstName || '',
              last_name: bookingData.customerInfo?.lastName || '',
              email: bookingData.customerInfo?.email || '',
              mobile: bookingData.customerInfo?.mobile || '',
              floor_unit: bookingData.customerInfo?.floorUnit || '',
              block_street: bookingData.customerInfo?.blockStreet || '',
              postal_code: bookingData.customerInfo?.postalCode || '',
              condo_name: bookingData.customerInfo?.condoName,
              lobby_tower: bookingData.customerInfo?.lobbyTower,
              special_instructions: bookingData.customerInfo?.specialInstructions
            },
            
            // Booking details
            brands: bookingData.brands || [],
            issues: bookingData.issues || [],
            other_issue: bookingData.otherIssue,
            is_amc: false,
            
            // Schedule
            scheduled_datetime: bookingData.scheduledDateTime || new Date(),
            scheduled_timeslot: bookingData.scheduledTimeSlot || '',
            
            // Status
            status: 'pending',
            payment_status: 'pending',
            total_amount: bookingData.selectedService?.price || 0,
            tip_amount: 0,
            
            // Metadata
            metadata: {
              source: 'web',
              version: '1.0',
              isFirstTimeFlow: bookingData.isFirstTimeFlow
            }
          };

          // Create the booking in Supabase
          const supabaseBookingId = await createBooking(bookingDetails);
          
          logPaymentEvent('Initializing payment', {
            amount: bookingData.selectedService?.price,
            serviceId: serviceDetails.id,
            bookingId: supabaseBookingId,
            customerId: currentUser?.id
          });

          const intent = await createPaymentIntent(
            bookingData.selectedService?.price || 0,
            serviceDetails.id,
            supabaseBookingId,
            0,
            'sgd',
            currentUser?.id
          );

          logPaymentEvent('Payment intent created', {
            intentId: intent.id,
            amount: bookingData.selectedService?.price,
            status: intent.status
          });
          
          setPaymentState((prev) => ({
            ...prev,
            clientSecret: intent.clientSecret,
            status: PAYMENT_STATES.READY
          }));
        } catch (error) {
          paymentInitializedRef.current = false;  // Reset on error
          const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
          logPaymentEvent('Payment initialization error', { error: errorMessage });
          toast.error(errorMessage);
          setPaymentState((prev) => ({
            ...prev,
            status: PAYMENT_STATES.ERROR,
            error: errorMessage,
          }));
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing payment:', error);
      }
    };

    initializePayment();
  }, [
    bookingData?.selectedService?.id,
    bookingData?.selectedService?.price,
    bookingData?.bookingId,
    paymentState.clientSecret,
    currentUser?.id
  ]);

  // Log initial booking data
  useEffect(() => {
    logPaymentEvent('PaymentStep mounted with booking data:', {
      customerInfo: bookingData.customerInfo,
      bookingId: bookingData.bookingId,
      selectedService: bookingData.selectedService,
      scheduledDateTime: bookingData.scheduledDateTime,
      scheduledTimeSlot: bookingData.scheduledTimeSlot
    });
  }, [bookingData]);

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
      logPaymentEvent('Payment success handler started', { 
        intentId: paymentIntent.id,
        bookingId: bookingData.bookingId,
        amount: paymentIntent.amount
      });
      
      await dispatch(setPaymentStatus('processing'));
      
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATES.SUCCESS,
      }));

      // Update booking status in Redux
      if (bookingData.bookingId) {
        logPaymentEvent('Updating booking status', {
          bookingId: bookingData.bookingId,
          status: 'Confirmed',
          paymentId: paymentIntent.id
        });

        await dispatch(updateBooking({
          id: bookingData.bookingId,
          status: 'Confirmed',
          paymentStatus: 'Completed',
          paymentId: paymentIntent.id,
          updatedAt: new Date().toISOString()
        }));
      }

      logPaymentEvent('Payment flow completed successfully', {
        intentId: paymentIntent.id,
        bookingId: bookingData.bookingId
      });

      // Complete the payment
      await handlePaymentComplete(paymentIntent.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logPaymentEvent('Payment success handler error', { error: errorMessage });
      console.error('Error in payment success handler:', error);
      toast.error('Error completing payment. Please contact support.');
    }
  }, [bookingData.bookingId, dispatch, handlePaymentComplete]);

  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!stripe || !elements || !mounted) return;

      setIsLoading(true);
      try {
        logPaymentEvent('Starting payment submission...');
        
        const { error: submitError } = await elements.submit();
        if (submitError) {
          console.error('Elements submit error:', submitError);
          throw submitError;
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: `${bookingData.customerInfo?.firstName} ${bookingData.customerInfo?.lastName}`,
                email: bookingData.customerInfo?.email,
                phone: bookingData.customerInfo?.mobile,
                address: {
                  line1: bookingData.customerInfo?.blockStreet,
                  line2: bookingData.customerInfo?.floorUnit,
                  postal_code: bookingData.customerInfo?.postalCode,
                }
              },
            },
            return_url: window.location.origin + '/payment-success',
          },
          redirect: 'if_required',
        });

        if (confirmError) {
          console.error('Payment confirmation error:', confirmError);
          throw confirmError;
        }

        if (paymentIntent) {
          logPaymentEvent('Payment successful:', paymentIntent);
          handlePaymentSuccess(paymentIntent);
          toast.success('Payment successful!');
        }
      } catch (error) {
        console.error('Payment error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Payment failed';
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (!mounted) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-2 sm:p-6">
          <PaymentElement 
            id="payment-element"
            options={{
              layout: 'tabs'
            }}
          />
          
          <button
            type="submit"
            disabled={!stripe || isLoading}
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
            {isLoading ? (
              <>
                <ImSpinner8 className="animate-spin h-5 w-5" />
                <span>Processing...</span>
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </form>
    );
  };

  // Render the main component
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

          <div className="w-full max-w-4xl mx-auto">
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret: paymentState.clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#eab308',
                    colorBackground: '#1e293b',
                    colorText: '#f8fafc',
                    colorDanger: '#ef4444',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  },
                },
                loader: 'auto',
              }}
            >
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

              {/* Payment Form */}
              <div className="bg-gray-800/90 rounded-lg p-2 sm:p-6">
                <PaymentForm />
              </div>

              {paymentState.error && (
                <div className="p-2 sm:p-4 bg-red-50 text-red-700 rounded-md mt-4">
                  {paymentState.error}
                </div>
              )}
            </Elements>
          </div>

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

  if (paymentState.status === PAYMENT_STATES.SUCCESS) {
    return (
      <PaymentErrorBoundary>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl mx-auto py-1 px-0.5 sm:py-8 sm:px-4"
        >
          <BookingConfirmation
            reference={paymentState.clientSecret}
            onComplete={handlePaymentComplete}
          />
        </motion.div>
      </PaymentErrorBoundary>
    );
  }

  return null;
};

PaymentStep.displayName = 'PaymentStep';

export { PaymentStep };
export default PaymentStep;
