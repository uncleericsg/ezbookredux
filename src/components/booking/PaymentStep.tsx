import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ImSpinner8 } from 'react-icons/im';
import { motion } from 'framer-motion';

// Types
import type { PaymentStatus, PaymentError } from '@shared/types/payment';
import type { BookingData, PaymentStepProps } from '../../types/booking-flow';
import type { ApiError } from '@/types/error';

// Components
import { BookingSummary } from '@components/booking/BookingSummary';

// Utils
import { cn } from '@utils/cn';
import { logger } from '@utils/logger';

interface PaymentState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: PaymentError | null;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  bookingData,
  onComplete,
  onBack,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<PaymentState>({
    status: 'idle',
    error: null
  });

  // Enhanced logging for debugging
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

    logger.info(`[PaymentStep ${timestamp}] ${event}`, {
      ...data,
      device: deviceInfo
    });
  };

  const initiateCheckout = async () => {
    if (!bookingData.serviceId || !bookingData.customerInfo) {
      toast.error('Missing required booking information');
      return;
    }

    setState({ ...state, status: 'loading' });

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingData.serviceId,
          amount: bookingData.servicePrice,
          currency: 'sgd',
          customerEmail: bookingData.customerInfo.email,
          successUrl: `${window.location.origin}/bookings/${bookingData.serviceId}/success`,
          cancelUrl: `${window.location.origin}/bookings/${bookingData.serviceId}/cancel`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initiate checkout');
      }

      const { checkoutUrl } = await response.json();
      logPaymentEvent('Redirecting to Stripe Checkout', { checkoutUrl });
      window.location.href = checkoutUrl;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      const errorMetadata = {
        bookingId: bookingData.serviceId,
        serviceId: bookingData.serviceId,
        customerEmail: bookingData.customerInfo?.email,
        error: error instanceof Error ? error : undefined
      };
      
      logPaymentEvent('Checkout Error', errorMetadata);
      
      setState({
        status: 'error',
        error: {
          code: 'PAYMENT_FAILED',
          message: errorMessage
        }
      });
      toast.error('Unable to process payment. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <BookingSummary
        data={{
          service_title: bookingData.serviceTitle,
          service_price: bookingData.servicePrice,
          service_duration: String(bookingData.serviceDuration),
          customer_info: {
            first_name: bookingData.customerInfo.firstName,
            last_name: bookingData.customerInfo.lastName,
            email: bookingData.customerInfo.email,
            mobile: bookingData.customerInfo.phone,
            floor_unit: bookingData.customerInfo.address.floorUnit || '',
            block_street: bookingData.customerInfo.address.blockStreet,
            postal_code: bookingData.customerInfo.address.postalCode,
            condo_name: bookingData.customerInfo.address.condoName || undefined,
            lobby_tower: bookingData.customerInfo.address.lobbyTower || undefined,
            special_instructions: bookingData.customerInfo.specialInstructions || undefined
          },
          scheduled_datetime: new Date(bookingData.date),
          scheduled_timeslot: bookingData.time,
          total_amount: bookingData.servicePrice,
          tip_amount: 0 // Tip handling moved to Stripe Checkout
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-4"
      >
        <button
          onClick={initiateCheckout}
          disabled={state.status === 'loading'}
          className={cn(
            "w-full max-w-md px-6 py-3 text-lg font-semibold text-white",
            "bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "flex items-center justify-center space-x-2"
          )}
        >
          {state.status === 'loading' ? (
            <>
              <ImSpinner8 className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Proceed to Payment</span>
          )}
        </button>

        <button
          onClick={onBack}
          disabled={state.status === 'loading'}
          className={cn(
            "px-6 py-2 text-gray-600 hover:text-gray-800",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200"
          )}
        >
          Back
        </button>

        {state.error && (
          <div className="w-full max-w-md p-4 bg-red-50 text-red-600 rounded-lg">
            <p>{state.error.message}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentStep;
