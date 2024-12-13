import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAmount } from '../store/slices/paymentSlice';
import PaymentFlow from './PaymentFlow';

interface ServiceDetails {
  title: string;
  price: number;
  duration: string;
}

interface PaymentSummaryProps {
  serviceDetails?: ServiceDetails;
  scheduledDateTime?: Date;
  scheduledTimeSlot?: string;
  onTipChange?: (tipAmount: number) => void;
  tipAmount?: number;
  customerInfo?: {
    blockStreet?: string;
    floorUnit?: string;
    postalCode?: string;
    condoName?: string;
  };
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  serviceDetails,
  scheduledDateTime,
  scheduledTimeSlot,
  onTipChange,
  tipAmount: externalTipAmount = 0,
  customerInfo,
}) => {
  const [localTipAmount, setLocalTipAmount] = useState(externalTipAmount);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const dispatch = useAppDispatch();
  const paymentState = useAppSelector(state => state.payment);
  const tipAmount = typeof externalTipAmount === 'number' ? externalTipAmount : localTipAmount;
  const serviceAmount = serviceDetails?.price || 0;
  const total = serviceAmount + (tipAmount || 0);

  // Update payment context when total changes
  useEffect(() => {
    dispatch(setAmount(total));
  }, [total, dispatch]);

  const handleTipChange = (value: number) => {
    setLocalTipAmount(value);
    onTipChange?.(value);
  };

  const formatAmount = (value: number): string => {
    return value.toFixed(2);
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment
    setShowPaymentFlow(false);
  };

  const handlePaymentCancel = () => {
    setShowPaymentFlow(false);
  };

  if (!serviceDetails) {
    return null;
  }

  if (showPaymentFlow) {
    return (
      <PaymentFlow
        amount={total}
        serviceDetails={{
          type: serviceDetails.title,
          date: scheduledDateTime?.toISOString() || new Date().toISOString(),
          time: scheduledTimeSlot || '',
          duration: parseInt(serviceDetails.duration)
        }}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
      <h3 className="text-xl font-semibold mb-8 text-[#FFD700] text-center">Payment Details</h3>

      <div className="space-y-8">
        <div className="text-center">
          <p className="text-base text-gray-400 mb-2">Service Fee</p>
          <p className="text-3xl font-bold text-[#FFD700] mb-2">${formatAmount(serviceAmount)}</p>
          <p className="text-lg text-gray-300">{serviceDetails.title}</p>
        </div>

        {scheduledDateTime && (
          <div className="text-center">
            <p className="text-base text-gray-400 mb-2">Appointment Date</p>
            <p className="text-xl text-gray-300 mb-1">{format(scheduledDateTime, 'MMMM d, yyyy')}</p>
            {scheduledTimeSlot && (
              <p className="text-xl text-gray-300">{scheduledTimeSlot}</p>
            )}
          </div>
        )}

        {customerInfo && (
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-5 w-5 text-[#FFD700] mr-2" />
              <p className="text-base text-gray-400">Service Location</p>
            </div>
            <p className="text-lg text-gray-300">
              {customerInfo.floorUnit && `#${customerInfo.floorUnit}, `}
              {customerInfo.blockStreet}
            </p>
            {customerInfo.condoName && (
              <p className="text-lg text-gray-300">{customerInfo.condoName}</p>
            )}
            {customerInfo.postalCode && (
              <p className="text-lg text-gray-300">Singapore {customerInfo.postalCode}</p>
            )}
          </div>
        )}

        <div className="border-t border-gray-700 pt-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-pink-400" />
              <h4 className="text-base font-semibold text-pink-400">Show Your Appreciation</h4>
            </div>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Recognize our team's dedication with a tip
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 px-2">
            {[5, 10, 15, 20].map((tip) => (
              <motion.button
                key={tip}
                onClick={() => handleTipChange(tip)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  tipAmount === tip
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                }`}
              >
                ${tip}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-base text-gray-400 mb-2">Total Amount</p>
          <motion.button
            onClick={() => setShowPaymentFlow(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-3xl font-bold text-[#FFD700] hover:text-[#FFE55C] transition-colors cursor-pointer"
          >
            ${formatAmount(total)}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;