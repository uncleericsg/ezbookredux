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
 * @ai-flow-protection: The payment payment flow and validation sequence must not be altered
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

/*
 * @ai-protection - CRITICAL COMPONENT - DO NOT MODIFY WITHOUT REVIEW
 * This component is a core part of the payment processing system.
 * See documentation at the top of the file for details.
 */

// React and hooks
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Utils
import { cn } from '@utils/cn';
import { isValidServiceData } from '@utils/validation';
import { format } from 'date-fns';

// External libraries
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';
import { HiHeart } from 'react-icons/hi2';
import { toast } from 'sonner';

// Components
import { BookingSummary } from '@components/booking/BookingSummary';
import { BookingConfirmation } from '@components/booking/BookingConfirmation';

// Redux
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setError, setPaymentStatus } from '../../store/slices/userSlice';
import { setCurrentBooking, updateBooking } from '../../store/slices/bookingSlice';

// Services
import { getStripe } from '@services/stripe';
import { createPaymentIntent, addToServiceQueue } from '@services/paymentService';
import { createBooking } from '@services/supabaseBookingService';
import { getServiceByAppointmentType } from '@services/serviceUtils';

// Types and Constants
type ServiceType = 'repair' | 'maintenance' | 'installation';
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Payment States and Types
const PAYMENT_STATES = {
  INITIAL: 'INITIAL',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED'
} as const;

type PaymentStateType = typeof PAYMENT_STATES[keyof typeof PAYMENT_STATES];

// Stripe types
type StripePaymentStatus = 'requires_payment_method' | 'processing' | 'succeeded' | 'failed';

// Stripe API response types
interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  status: StripePaymentStatus;
  amount?: number;
}

interface StripePaymentResponse {
  id: string;
  clientSecret: string;
}

// Type guard for PaymentIntent
const isPaymentIntent = (obj: any): obj is StripePaymentIntent => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.clientSecret === 'string';
};

// Helper to safely access payment intent
const getPaymentIntentStatus = (intent: StripePaymentResponse): StripePaymentStatus => {
  return (intent as StripePaymentIntent).status || 'requires_payment_method';
};

interface PaymentState {
  status: PaymentStateType;
  clientSecret: string | null;
  error: string | null;
  tipAmount: number;
}

const initialPaymentState: PaymentState = {
  status: PAYMENT_STATES.INITIALIZING,
  clientSecret: null,
  error: null,
  tipAmount: 0
};

interface RootState {
  user: {
    currentUser: any;
    error: string | null;
  };
  booking: {
    currentBooking: any;
  };
}

interface BookingDetails {
  service_id: string;
  service_title: string;
  service_price: number;
  service_duration: string;
  service_description: string;
  customer_info: {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    floor_unit: string;
    block_street: string;
    postal_code: string;
    condo_name?: string;
    lobby_tower?: string;
    special_instructions?: string;
  };
  brands: string[];
  issues: string[];
  other_issue?: string;
  is_amc: boolean;
  scheduled_datetime: Date;
  scheduled_timeslot: string;
  status: BookingStatus;
  payment_status: string;
  total_amount: number;
  tip_amount: number;
}

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

interface PaymentStepContentProps {
  paymentState: PaymentState;
  setPaymentState: React.Dispatch<React.SetStateAction<PaymentState>>;
  bookingData: PaymentStepProps['bookingData'];
  onBack: () => void;
  onSuccess: () => void;
}


// Enhanced logging for mobile debugging
const logPaymentEvent = (event: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const deviceInfo = {
    type: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    online: navigator.onLine
  };

  console.log(`[PaymentStep ${timestamp}] ${event}`, {
    ...data,
    device: deviceInfo
  });
};

// Utility functions
const calculateTotalAmount = (baseAmount: number, tipAmount: number = 0) => {
  return baseAmount + tipAmount;
};

// Add network utility functions
const checkNetworkConnection = () => {
  return {
    online: navigator.onLine,
    type: (navigator as any).connection?.type || 'unknown',
    effectiveType: (navigator as any).connection?.effectiveType || 'unknown'
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Main Payment Step Component - Handles initialization and Elements wrapping
const PaymentStep: React.FC<PaymentStepProps> = ({
  bookingData,
  onComplete,
  onBack,
}: PaymentStepProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, error: userError } = useAppSelector((state: RootState) => state.user);
  const { currentBooking } = useAppSelector((state: RootState) => state.booking);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.focus();
    }
  }, []);

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
        id: bookingData.bookingId || '',
        userId: currentUser?.id || '',
        serviceType: (bookingData.selectedService?.title as ServiceType) || 'repair',
        status: 'pending',
        scheduledDate: bookingData.scheduledDateTime ? format(bookingData.scheduledDateTime, 'PP') : '',
        address: `${bookingData.customerInfo?.blockStreet || ''}, ${bookingData.customerInfo?.postalCode || ''}`,
        notes: bookingData.customerInfo?.specialInstructions,
        price: bookingData.selectedService?.price || 0
      }));
    }
  }, [bookingData, currentBooking, dispatch]);

  // State management
  const [isLoading, setIsLoading] = useState(false);  // Start with false to prevent UI flicker
  const [paymentState, setPaymentState] = useState<PaymentState>(initialPaymentState);
  const [stripePromise] = useState(getStripe);

  // Add initialization timing tracking
  const initStartTime = useRef<number>(0);
  const mountTime = useRef<number>(Date.now());
  const stagesCompleted = useRef<string[]>([]);

  // Enhanced component mount logging
  useEffect(() => {
    mountTime.current = Date.now();
    logPaymentEvent('Component mounted', {
      hasClientSecret: !!paymentState.clientSecret,
      bookingId: bookingData?.bookingId,
      serviceId: bookingData?.selectedService?.id,
      price: bookingData?.selectedService?.price,
      status: paymentState.status,
      mountTime: mountTime.current
    });

    return () => {
      logPaymentEvent('Component unmounting', {
        mountDuration: Date.now() - mountTime.current,
        completedStages: stagesCompleted.current
      });
    };
  }, []);

  // Track payment state changes
  useEffect(() => {
    logPaymentEvent('Payment state changed', {
      previousStages: stagesCompleted.current,
      currentStatus: paymentState.status,
      hasError: !!paymentState.error,
      timeSinceMount: Date.now() - mountTime.current
    });
  }, [paymentState.status]);

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
      stagesCompleted.current = [];
      const startTime = Date.now();

      try {
        logPaymentEvent('Initializing payment', {
          selectedService: bookingData.selectedService,
          amount: bookingData.selectedService?.price || 0
        });

        // Validate service data first
        if (!bookingData.selectedService || !isValidServiceData(bookingData.selectedService)) {
          logPaymentEvent('Invalid service data', {
            service: bookingData.selectedService
          });
          throw new Error('Invalid service data');
        }

        // Get the actual service UUID from Supabase
        const serviceDetails = await getServiceByAppointmentType(bookingData.selectedService.id);  // Frontend sends appointment_type_id as id
        if (!serviceDetails) {
          logPaymentEvent('Service not found', {
            appointmentTypeId: bookingData.selectedService.id
          });
          throw new Error('Service not found');
        }
        stagesCompleted.current.push('service_details_fetched');
        
        // Create booking details
        logPaymentEvent('Creating booking details');
        const bookingDetails: BookingDetails = {
          service_id: serviceDetails.id, // Use the UUID from database
          service_title: serviceDetails.title,
          service_price: serviceDetails.price,
          service_duration: serviceDetails.duration,
          service_description: serviceDetails.description,
          
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
          total_amount: calculateTotalAmount(serviceDetails.price, paymentState.tipAmount),
          tip_amount: paymentState.tipAmount,
        };

        // Create the booking in Supabase
        logPaymentEvent('Creating Supabase booking');
        const supabaseBookingId = await createBooking(bookingDetails);
        stagesCompleted.current.push('booking_created');

        // Create payment intent with retry mechanism
        const total = calculateTotalAmount(serviceDetails.price, paymentState.tipAmount);
        
        let paymentIntent;
        let attemptCount = 0;
        
        while (attemptCount < 3) {
          try {
            logPaymentEvent('Creating payment intent', {
              attempt: attemptCount + 1,
              amount: total,
              serviceId: serviceDetails.id,
              bookingId: supabaseBookingId,
              timeSinceInit: Date.now() - startTime,
              networkStatus: checkNetworkConnection()
            });

            paymentIntent = await createPaymentIntent(
              total, // Pass the raw amount, service will convert to cents
              serviceDetails.id,
              supabaseBookingId,
              paymentState.tipAmount,
              'sgd',
              currentUser?.id
            );
            
            break; // Success, exit retry loop
          } catch (error) {
            attemptCount++;
            if (attemptCount === 3 || !(error instanceof Error && error.message === 'Network Error')) {
              throw error; // Rethrow if max retries reached or not a network error
            }
            logPaymentEvent('Payment intent creation failed, retrying', {
              attempt: attemptCount,
              error: error instanceof Error ? error.message : 'Unknown error',
              nextRetryIn: 1000 * attemptCount
            });
            await delay(1000 * attemptCount); // Exponential backoff
          }
        }

        if (!paymentIntent) {
          throw new Error('Failed to create payment intent after retries');
        }

        stagesCompleted.current.push('payment_intent_created');

        logPaymentEvent('Payment intent created', {
          intentId: paymentIntent.id,
          amount: total,
          status: getPaymentIntentStatus(paymentIntent),
          timeSinceInit: Date.now() - startTime,
          networkStatus: checkNetworkConnection()
        });

        setPaymentState((prev) => ({
          ...prev,
          clientSecret: paymentIntent.clientSecret,
          status: PAYMENT_STATES.READY
        }));
        stagesCompleted.current.push('state_updated_ready');

      } catch (error) {
        paymentInitializedRef.current = false;
        const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
        logPaymentEvent('Payment initialization error', {
          error: errorMessage,
          stage: stagesCompleted.current[stagesCompleted.current.length - 1],
          timeSinceInit: Date.now() - startTime,
          networkStatus: checkNetworkConnection()
        });
        toast.error(errorMessage);
        setPaymentState((prev) => ({
          ...prev,
          status: PAYMENT_STATES.ERROR,
          error: errorMessage || null,
        }));
      } finally {
        setIsLoading(false);
        logPaymentEvent('Initialization complete', {
          success: !paymentState.error,
          stages: stagesCompleted.current,
          totalTime: Date.now() - startTime,
          networkStatus: checkNetworkConnection()
        });
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
          status: 'confirmed',
          paymentId: paymentIntent.id
        });

        await dispatch(updateBooking({
          id: bookingData.bookingId || '',
          userId: currentUser?.id || '',
          serviceType: (bookingData.selectedService?.title as ServiceType) || 'repair',
          status: 'confirmed',
          scheduledDate: bookingData.scheduledDateTime ? format(bookingData.scheduledDateTime, 'PP') : '',
          address: `${bookingData.customerInfo?.blockStreet || ''}, ${bookingData.customerInfo?.postalCode || ''}`,
          notes: `Payment ID: ${paymentIntent.id}`,
          price: bookingData.selectedService?.price || 0
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
    const stripePromise = getStripe();
    return (
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
              clientSecret: paymentState.clientSecret || '',
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
                    <span className="font-medium text-white">Total: ${calculateTotalAmount(bookingData.selectedService?.price || 0, paymentState.tipAmount)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Form */}
            <PaymentStepContent
              bookingData={bookingData}
              paymentState={paymentState}
              setPaymentState={setPaymentState}
              onBack={onBack}
              onSuccess={() => {
                if (paymentState.clientSecret) {
                  onComplete(paymentState.clientSecret);
                }
              }}
            />
          </Elements>
        </div>
      </motion.div>
    );
  }

  // Render success state
  if (paymentState.status === PAYMENT_STATES.SUCCESS) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto py-1 px-0.5 sm:py-8 sm:px-4"
      >
        <BookingConfirmation
          bookingReference={paymentState.clientSecret || ''}
          onDownloadReceipt={() => handlePaymentComplete(paymentState.clientSecret || '')}
        />
      </motion.div>
    );
  }

  return null;
};

const PaymentStepContent = ({
  bookingData,
  paymentState,
  setPaymentState,
  onBack,
  onSuccess
}: PaymentStepContentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized');
      return;
    }
    setIsLoading(true);
    
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        setPaymentState(prev => ({
          ...prev,
          status: PAYMENT_STATES.ERROR,
          error: error.message || null
        }));
        return;
      }

      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.SUCCESS
      }));
      
      onSuccess?.();
    } catch (error) {
      console.error('Payment submission error:', error);
      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: 'An unexpected error occurred during payment'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800/90 rounded-lg p-2 sm:p-6">
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiCreditCard className="h-5 w-5" />
              <span>Pay Now ${calculateTotalAmount(bookingData.selectedService?.price || 0, paymentState.tipAmount)}</span>
            </>
          )}
        </button>
      </form>

      {/* Back Button - Hidden during loading */}
      <button
        onClick={onBack}
        className="absolute bottom-4 left-4 px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
        disabled={isLoading}
      >
        Back
      </button>
    </div>
  );
};

PaymentStep.displayName = 'PaymentStep';

export { PaymentStep };
export default PaymentStep;
