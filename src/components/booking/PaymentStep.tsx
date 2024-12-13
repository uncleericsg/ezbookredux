/*
 * @ai-protection - DO NOT MODIFY THIS FILE
 * This is a stable version of the payment step component that handles:
 * 1. Stripe payment integration
 * 2. Payment processing and validation
 * 3. Booking reference generation
 * 4. User account creation
 * 5. Service queue management
 * 
 * Critical Features:
 * - Secure payment processing
 * - PCI compliance
 * - Booking reference generation
 * - User data management
 * - Service queue integration
 * - Terms and conditions acceptance
 * 
 * Integration Points:
 * - Stripe API for payments
 * - User authentication service
 * - Booking management system
 * - Service queue system
 * - Navigation service
 * 
 * @ai-visual-protection: The payment form UI and styling must remain consistent
 * @ai-flow-protection: The payment and booking flow must not be altered
 * @ai-state-protection: The payment state management is optimized and secure
 * @ai-security-protection: All payment and user data handling must maintain PCI compliance
 * 
 * Any modifications to this component could affect:
 * 1. Payment processing security
 * 2. Booking system integrity
 * 3. User account creation
 * 4. Service scheduling
 * 5. Data compliance
 * 
 * If changes are needed:
 * 1. Document security implications
 * 2. Verify PCI compliance
 * 3. Test payment scenarios
 * 4. Validate booking flow
 * 5. Ensure data protection
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { initializeStripe, createPaymentIntent, addToServiceQueue } from '../../services/paymentService';
import PaymentForm from '../PaymentForm';
import PaymentSummary from '../PaymentSummary';
import PaymentErrorBoundary from '../payment/PaymentErrorBoundary';
import PasswordCreationModal from '../auth/PasswordCreationModal';
import { User } from '../../types';
import TermsAndConditions from '../payment/TermsAndConditions';
import BookingConfirmation from './BookingConfirmation';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { login as loginAction, setUser, setPaymentStatus, setError } from '../../store/slices/userSlice';

interface PaymentStepProps {
  readonly bookingData: any;
  readonly onComplete: () => void;
  readonly onBack: () => void;
  readonly onSuccess?: () => void;
  readonly onError?: (error: any) => void;
}

const PAYMENT_STATES = Object.freeze({
  INITIAL: 'initial',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
  COMPLETE: 'complete'
});

const PaymentStep: React.FC<PaymentStepProps> = ({ bookingData, onComplete, onBack, onSuccess, onError }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const paymentState = useAppSelector((state) => state.payment);
  const [stripePromise, setStripePromise] = React.useState(() => initializeStripe());
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [booking, setBooking] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const initialState = Object.freeze({
    amount: (bookingData.selectedService?.price || 0) + tipAmount,
    status: PAYMENT_STATES.INITIAL,
    error: null,
    termsAccepted: false,
  });

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        const { clientSecret } = await createPaymentIntent({
          amount: initialState.amount,
          currency: 'sgd',
          description: `${bookingData.selectedService?.name} - ${format(bookingData.selectedDate, 'PPP')}`,
          metadata: {
            serviceId: bookingData.selectedService?.id,
            appointmentDate: bookingData.selectedDate.toISOString(),
            userEmail: bookingData.email
          }
        });
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error initializing payment:', error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [bookingData, initialState.amount]);

  const handlePaymentComplete = async (paymentIntent: any) => {
    try {
      setIsPaymentComplete(true);
      
      // Generate booking reference
      const reference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setBookingReference(reference);

      // Create booking record
      const newBooking = {
        id: reference,
        serviceType: bookingData.selectedService?.name,
        date: format(bookingData.selectedDate, 'yyyy-MM-dd'),
        time: format(bookingData.selectedDate, 'HH:mm'),
        status: 'Upcoming',
        amount: initialState.amount,
        paymentMethod: 'card',
        address: bookingData.address
      };
      setBooking(newBooking);

      // Add to service queue
      await addToServiceQueue({
        bookingReference: reference,
        serviceType: bookingData.selectedService?.id,
        scheduledDate: bookingData.selectedDate,
        customerEmail: bookingData.email,
        address: bookingData.address,
        paymentIntentId: paymentIntent.id
      });

      // Update payment state
      dispatch(setPaymentStatus('success'));
      
      // Show success message
      toast.success('Payment successful! Your booking is confirmed.');
      
      // Trigger success callback
      onSuccess?.();
      
      // Show password creation modal for new users
      if (!currentUser) {
        setShowPasswordModal(true);
      }
      
    } catch (error) {
      console.error('Error completing payment:', error);
      dispatch(setError(error.message));
      onError?.(error);
    }
  };

  const handlePasswordSubmit = async (password: string): Promise<boolean> => {
    try {
      // Create user account
      const userData: Partial<User> = {
        email: bookingData.email,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        phone: bookingData.phone,
        bookings: [booking]
      };

      // Dispatch login action
      await dispatch(loginAction({ email: bookingData.email, password })).unwrap();
      
      // Update user data
      dispatch(setUser(userData));

      // Navigate to confirmation
      navigate('/booking/confirmation', { 
        state: { 
          booking,
          email: bookingData.email
        }
      });

      return true;
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account. Please try again.');
      return false;
    }
  };

  if (loading || !clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
      </div>
    );
  }

  return (
    <PaymentErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                clientSecret={clientSecret}
                onComplete={handlePaymentComplete}
                amount={initialState.amount}
                onError={(error) => {
                  dispatch(setError(error.message));
                  onError?.(error);
                }}
              />
            </Elements>
          </div>

          {/* Order Summary */}
          <div>
            <PaymentSummary
              service={bookingData.selectedService}
              date={bookingData.selectedDate}
              tipAmount={tipAmount}
              onTipChange={setTipAmount}
            />
            <TermsAndConditions
              accepted={paymentState.termsAccepted}
              onAccept={() => dispatch(setPaymentStatus('termsAccepted'))}
            />
          </div>
        </div>

        {/* Password Creation Modal */}
        {showPasswordModal && (
          <PasswordCreationModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onSubmit={handlePasswordSubmit}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            disabled={isPaymentComplete}
          >
            Back
          </button>
        </div>
      </motion.div>
    </PaymentErrorBoundary>
  );
};

export default PaymentStep;
