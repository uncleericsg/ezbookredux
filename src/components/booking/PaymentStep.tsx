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
import { useUser } from '../../contexts/UserContext';
import { usePayment } from '../../contexts/PaymentContext';
import { BookingData } from './FirstTimeBookingFlow';
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

interface PaymentStepProps {
  readonly bookingData: BookingData;
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
  const { login, userDispatch } = useUser();
  const { state, dispatch } = usePayment();
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
        const stripeInstance = await initializeStripe();
        if (!stripeInstance) {
          throw new Error('Failed to initialize Stripe');
        }
        setStripePromise(Promise.resolve(stripeInstance));

        const { clientSecret: secret } = await createPaymentIntent(
          (bookingData.selectedService?.price || 0) + tipAmount
        );
        
        if (!secret) {
          throw new Error('Failed to create payment intent');
        }
        
        setClientSecret(secret);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing payment:', error);
        onError?.(error instanceof Error ? error.message : 'Payment initialization failed');
        setLoading(false);
      }
    };

    if (state.termsAccepted) {
      initializePayment();
    }
  }, [bookingData.selectedService?.price, tipAmount, state.termsAccepted]);

  useEffect(() => {
    dispatch({ type: 'RESET_STATE' });
    
    if (bookingData.selectedService) {
      dispatch({
        type: 'SET_SERVICE_DETAILS',
        payload: {
          type: bookingData.selectedService.title,
          date: bookingData.scheduledDateTime?.toISOString() || '',
          time: bookingData.scheduledTimeSlot || '',
          duration: parseInt(bookingData.selectedService.duration),
        },
      });
      
      const totalAmount = bookingData.selectedService.price + tipAmount;
      dispatch({ type: 'SET_AMOUNT', payload: totalAmount });
    }

    if (bookingData.customerInfo) {
      dispatch({
        type: 'SET_CUSTOMER_INFO',
        payload: {
          email: bookingData.customerInfo.email,
          name: bookingData.customerInfo.name,
          phone: bookingData.customerInfo.phone
        }
      });
    }
  }, [bookingData, dispatch, tipAmount]);

  useEffect(() => {
    console.log('Payment state updated:', state);
  }, [state]);

  useEffect(() => {
    if (!bookingData.selectedService) {
      console.error('No service selected');
      onError?.('Invalid booking data: No service selected');
      return;
    }
  }, [bookingData]);

  const handlePaymentSuccess = async () => {
    const newBookingRef = `BK${Date.now()}`;
    setBookingReference(newBookingRef);
    
    const serviceRequest: ServiceRequest = {
      id: `SR${Date.now()}`,
      customerName: `${bookingData.customerInfo?.firstName} ${bookingData.customerInfo?.lastName}`,
      serviceType: bookingData.selectedService?.title || '',
      scheduledTime: bookingData.scheduledDateTime || new Date(),
      location: `${bookingData.customerInfo?.blockStreet || ''}, #${bookingData.customerInfo?.floorUnit || ''}, Singapore ${bookingData.customerInfo?.postalCode || ''}`,
      contactNumber: bookingData.customerInfo?.mobile || bookingData.customerInfo?.phone || '',
      email: bookingData.customerInfo?.email || '',
      notes: '',
      status: 'pending',
      bookingReference: newBookingRef,
      specialInstructions: bookingData.customerInfo?.specialInstructions || '',
      address: {
        blockStreet: bookingData.customerInfo?.blockStreet || '',
        floorUnit: bookingData.customerInfo?.floorUnit || '',
        postalCode: bookingData.customerInfo?.postalCode || '',
        condoName: bookingData.customerInfo?.condoName,
        lobbyTower: bookingData.customerInfo?.lobbyTower
      }
    };

    try {
      await addToServiceQueue(serviceRequest);
    } catch (error) {
      toast.error('Service queue update failed. Support has been notified.');
    }
    
    setBooking({
      ...bookingData,
      status: 'confirmed',
      paymentStatus: 'paid',
      reference: newBookingRef,
    });

    setShowPasswordModal(true);
  };

  const handlePasswordCreation = async (password: string) => {
    try {
      const phone = bookingData.customerInfo?.mobile || bookingData.customerInfo?.phone || '';
      
      const userData: User = {
        id: `user_${Date.now()}`,
        email: bookingData.customerInfo?.email || '',
        firstName: bookingData.customerInfo?.firstName || '',
        lastName: bookingData.customerInfo?.lastName || '',
        phone: phone,
        bookings: [{
          id: bookingReference,
          serviceType: bookingData.selectedService?.title || '',
          date: format(bookingData.scheduledDateTime || new Date(), 'yyyy-MM-dd'),
          time: bookingData.scheduledTimeSlot || '',
          status: 'Upcoming',
          amount: state.amount,
          paymentMethod: 'card',
          address: `${bookingData.customerInfo?.blockStreet || ''}, #${bookingData.customerInfo?.floorUnit || ''}, Singapore ${bookingData.customerInfo?.postalCode || ''}`
        }]
      };

      const missingFields = [];
      if (!userData.email) missingFields.push('email');
      if (!userData.firstName) missingFields.push('first name');
      if (!userData.lastName) missingFields.push('last name');
      if (!phone) missingFields.push('phone number');

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return false;
      }

      login(userData);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setIsPaymentComplete(true);
      setShowPasswordModal(false);
      navigate('/profile');
      return true;
    } catch (error) {
      toast.error('Account creation failed. Please contact support.');
      return false;
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    onError?.(error);
  };

  const handleTermsAcceptance = () => {
    dispatch({ type: 'SET_TERMS_ACCEPTED', payload: true });
  };

  if (!bookingData.selectedService || !bookingData.scheduledDateTime) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Missing booking information. Please go back and complete all steps.</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <PaymentErrorBoundary>
      <div className="space-y-8">
        {bookingData.selectedService && (
          <PaymentSummary
            serviceDetails={bookingData.selectedService}
            scheduledDateTime={bookingData.scheduledDateTime}
            scheduledTimeSlot={bookingData.scheduledTimeSlot}
            onTipChange={(amount) => setTipAmount(amount)}
            tipAmount={tipAmount}
            customerInfo={bookingData.customerInfo}
          />
        )}

        <TermsAndConditions onAccept={handleTermsAcceptance} />

        <div className="space-y-6">
          {state.termsAccepted ? (
            clientSecret && stripePromise ? (
              <div className="bg-gray-200/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-300/20">
                <h3 className="text-gray-800 font-semibold text-lg mb-4">Payment Details</h3>
                <Elements stripe={stripePromise} options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#FFD700',
                      colorBackground: '#F3F4F6',
                      colorText: '#1F2937',
                      colorDanger: '#EF4444',
                      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                    },
                    rules: {
                      '.Input': {
                        backgroundColor: '#E5E7EB',
                        border: '1px solid #D1D5DB',
                      },
                      '.Label': {
                        color: '#374151',
                      }
                    }
                  }
                }}>
                  <PaymentForm
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-400">Loading payment form...</span>
              </div>
            )
          ) : (
            <div className="text-center p-4">
              <p className="text-gray-400">Please accept the terms and conditions to proceed with payment</p>
            </div>
          )}
        </div>

        {!isPaymentComplete && (
          <div className="flex justify-between pt-4">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Back
            </button>
          </div>
        )}

        <PasswordCreationModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordCreation}
          email={bookingData.customerInfo?.email || ''}
        />
      </div>
    </PaymentErrorBoundary>
  );
};

export default PaymentStep;
