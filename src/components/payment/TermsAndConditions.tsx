import React from 'react';
import { Shield, Check } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface TermsAndConditionsProps {
  onAccept?: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onAccept }) => {
  const { state, dispatch } = usePayment();

  const handleTermsAcceptance = () => {
    const newValue = !state.termsAccepted;
    dispatch({ type: 'SET_TERMS_ACCEPTED', payload: newValue });
    console.log('Terms acceptance toggled:', newValue); // Debug log
    
    if (newValue) {
      toast.success('Terms and conditions accepted');
      onAccept?.();
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        onClick={handleTermsAcceptance}
        animate={{
          boxShadow: !state.termsAccepted
            ? ['0 0 0 0 rgba(236, 72, 153, 0)', '0 0 30px 3px rgba(236, 72, 153, 0.5)', '0 0 0 0 rgba(236, 72, 153, 0)']
            : '0 0 0 0 rgba(236, 72, 153, 0)',
        }}
        transition={{
          duration: 1.5,
          repeat: !state.termsAccepted ? Infinity : 0,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className={`relative cursor-pointer rounded-lg p-6
          ${state.termsAccepted 
            ? 'bg-green-500/10 border-2 border-green-500/30' 
            : 'bg-blue-500/10 border border-blue-300/20'} 
          backdrop-blur-sm transition-all duration-300 
          hover:bg-opacity-20`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {state.termsAccepted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-2"
            >
              <div className="rounded-full bg-green-500/20 p-2">
                <Check className="h-6 w-6 text-green-500" />
              </div>
            </motion.div>
          ) : (
            <div className="mb-2">
              <div className="rounded-full bg-blue-500/20 p-2">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-300 text-center">
            By clicking, I agree to iAircon's Terms of Service and Privacy Policy
          </p>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-400">Your payment is secure and encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
