import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Tag, AlertTriangle } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setAmount, 
  setServiceDetails, 
  setPaymentStatus, 
  setError, 
  applyDiscount, 
  clearPaymentState 
} from '../store/slices/paymentSlice';
import { initializeStripe } from '../services/paymentService';
import TermsAndConditions from './payment/TermsAndConditions';

interface PaymentFlowProps {
  amount: number;
  serviceDetails: {
    type: string;
    date: string;
    time: string;
    duration: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({
  amount,
  serviceDetails,
  onSuccess,
  onCancel
}) => {
  const dispatch = useAppDispatch();
  const paymentState = useAppSelector(state => state.payment);
  const [stripePromise, setStripePromise] = React.useState<any>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = await initializeStripe();
        setStripePromise(stripe);
      } catch (error) {
        toast.error('Failed to initialize payment system');
        console.error('Stripe initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initStripe();
  }, []);

  useEffect(() => {
    dispatch(setAmount(amount));
    dispatch(setServiceDetails(serviceDetails));
  }, [amount, serviceDetails, dispatch]);

  useEffect(() => {
    // Initialize payment flow
    const initializePayment = async () => {
      try {
        dispatch(setPaymentStatus('processing'));
        const stripe = await initializeStripe();
        if (!stripe) throw new Error('Failed to initialize Stripe');
        
        // Reset any previous errors
        dispatch(setError(null));
      } catch (error) {
        console.error('Payment initialization error:', error);
        dispatch(setError('Failed to initialize payment system'));
      }
    };

    initializePayment();

    // Cleanup on unmount
    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh payment state when tab becomes visible
        dispatch(setPaymentStatus('idle'));
        dispatch(setError(null));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  const handleApplyDiscount = async () => {
    if (!paymentState.discount.code) return;
    
    dispatch(setPaymentStatus('processing'));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const discountAmount = amount * 0.1; // Example 10% discount
      dispatch(applyDiscount({ 
        code: paymentState.discount.code, 
        amount: discountAmount 
      }));
      toast.success('Discount code applied successfully');
    } catch (error) {
      dispatch(setError('Invalid discount code'));
      toast.error('Invalid discount code');
    } finally {
      dispatch(setPaymentStatus('idle'));
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const finalAmount = amount - paymentState.discount.amount;

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Service Details Section */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Service Type</span>
                <span>{serviceDetails.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span>{new Date(serviceDetails.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time</span>
                <span>{serviceDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span>{serviceDetails.duration} minutes</span>
              </div>
            </div>
          </div>

          {/* Discount Section */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-medium">Discount Code</h3>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={paymentState.discount.code}
                onChange={(e) => dispatch(applyDiscount({
                  code: e.target.value, 
                  amount: 0 
                }))}
                placeholder="Enter discount code"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
              <button
                onClick={handleApplyDiscount}
                disabled={!paymentState.discount.code || paymentState.paymentStatus === 'processing'}
                className="btn btn-primary"
              >
                {paymentState.paymentStatus === 'processing' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <TermsAndConditions 
            accepted={termsAccepted}
            onAcceptTerms={setTermsAccepted}
          />

          {/* Payment Form */}
          {stripePromise && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={finalAmount}
                onSuccess={onSuccess}
                disabled={!termsAccepted}
              />
            </Elements>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {paymentState.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{paymentState.error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentFlow;