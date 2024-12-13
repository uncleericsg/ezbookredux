import React from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, QrCode, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPaymentMethod } from '../../store/slices/paymentSlice';

interface PaymentMethodSelectorProps {
  selectedMethod: 'card' | 'paynow';
  onSelect: (method: 'card' | 'paynow') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const dispatch = useAppDispatch();
  const paymentState = useAppSelector(state => state.payment);

  const handleMethodSelect = (method: 'card' | 'paynow') => {
    console.log('Selecting payment method:', method);
    onSelect(method);
    dispatch(setPaymentMethod(method));
    toast.success(`Payment method set to ${method === 'card' ? 'Credit Card' : 'PayNow'}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Select Payment Method</h3>
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          type="button"
          onClick={() => handleMethodSelect('card')}
          className={`relative p-4 rounded-lg border transition-all duration-300 
            ${selectedMethod === 'card'
              ? 'bg-blue-500/10 backdrop-blur-sm border-blue-300/20 text-white shadow-lg ring-2 ring-green-500/30'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {selectedMethod === 'card' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <div className="rounded-full bg-green-500/20 p-1">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              </motion.div>
            )}
            <CreditCard className="h-6 w-6" />
            <span className="font-semibold text-lg">Credit Card</span>
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => handleMethodSelect('paynow')}
          className={`relative p-4 rounded-lg border transition-all duration-300 
            ${selectedMethod === 'paynow'
              ? 'bg-blue-500/10 backdrop-blur-sm border-blue-300/20 text-white shadow-lg ring-2 ring-green-500/30'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {selectedMethod === 'paynow' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <div className="rounded-full bg-green-500/20 p-1">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              </motion.div>
            )}
            <QrCode className="h-6 w-6" />
            <span className="font-semibold text-lg">PayNow</span>
            <span className="text-sm font-medium">QR Payment</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
