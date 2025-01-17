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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollToTop } from '@hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';
import type {
  PaymentStatus,
  PaymentDetails,
  PaymentError,
  PaymentIntentResponse,
  CreatePaymentIntentParams,
  StripePaymentIntent,
  StripePaymentStatus,
} from '@shared/types/payment';
import type { BookingStatus } from '@shared/types/booking';
import { logger } from '@/server/utils/logger';

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
import { getStripe } from '@/server/services/stripe/stripeService';
import { createPaymentIntent, addToServiceQueue } from '@/server/services/payments/paymentService';
import { createBooking } from '@/server/services/bookings/bookingService';
import { getServiceByAppointmentType } from '@/server/services/bookings/serviceUtils';

// Payment States and Types
const PAYMENT_STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

type PaymentStateType = typeof PAYMENT_STATES[keyof typeof PAYMENT_STATES];

const mapPaymentStatus = (status: PaymentStatus): PaymentStateType => {
  switch (status) {
    case 'pending':
      return PAYMENT_STATES.PENDING;
    case 'succeeded':
      return PAYMENT_STATES.SUCCESS;
    case 'failed':
      return PAYMENT_STATES.ERROR;
    default:
      return PAYMENT_STATES.IDLE;
  }
};

// Type guard for PaymentIntent
const isPaymentIntent = (obj: any): obj is StripePaymentIntent => {
  return obj && typeof obj === 'object' && 'clientSecret' in obj && 'status' in obj;
};

// Helper to safely access payment intent
const getPaymentIntentStatus = (intent: StripePaymentIntent): StripePaymentStatus => {
  return intent.status;
};

interface PaymentState {
  status: PaymentStateType;
  paymentIntent: PaymentIntentResponse | null;
  error: PaymentError | null;
  tipAmount: number;
}

const initialPaymentState: PaymentState = {
  status: PAYMENT_STATES.IDLE,
  paymentIntent: null,
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
  const [paymentState, setPaymentState] = useState<PaymentState>(initialPaymentState);
  const { processPayment, loading } = usePayment({
    onSuccess: (response) => {
      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.SUCCESS,
        paymentIntent: response,
        error: null
      }));
      onComplete(response.paymentIntentId);
    },
    onError: (error) => {
      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error
      }));
      logger.error('Payment failed', { error });
    }
  });

  const handlePayment = async () => {
    if (!bookingData.selectedService) {
      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATES.ERROR,
        error: {
          message: 'No service selected',
          code: 'INVALID_SERVICE'
        }
      }));
      return;
    }

    const params: CreatePaymentIntentParams = {
      amount: calculateTotalAmount(
        bookingData.selectedService.price,
        paymentState.tipAmount
      ),
      serviceId: bookingData.selectedService.id,
      bookingId: bookingData.bookingId || '',
      customerId: bookingData.customerInfo?.email || '',
      tipAmount: paymentState.tipAmount,
      currency: 'sgd'
    };

    setPaymentState(prev => ({
      ...prev,
      status: PAYMENT_STATES.PENDING
    }));

    await processPayment(params);
  };

  return (
    <div className="payment-step">
      <PaymentStepContent
        paymentState={paymentState}
        setPaymentState={setPaymentState}
        bookingData={bookingData}
        onBack={onBack}
        onSuccess={() => handlePayment()}
      />
    </div>
  );
};

const PaymentStepContent: React.FC<PaymentStepContentProps> = ({
  paymentState,
  setPaymentState,
  bookingData,
  onBack,
  onSuccess
}) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (paymentState.status === PAYMENT_STATES.PENDING) {
      return;
    }
    await onSuccess();
  };

  const renderError = () => {
    if (!paymentState.error) return null;
    return (
      <div className="payment-error">
        <p>{paymentState.error.message}</p>
        {paymentState.error.code === 'NETWORK_ERROR' && (
          <button onClick={handleSubmit}>Retry Payment</button>
        )}
      </div>
    );
  };

  // ... rest of the component ...
};

export default PaymentStep;
