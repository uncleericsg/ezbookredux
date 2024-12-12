import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { OTPInput } from './common/OTPInput';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { userDispatch } = useUser();

  // Handle mobile number input
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    setShowOtpButton(value === '91874498');
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && showOtpButton && !loading) {
      handleSendOtp();
    }
  };

  // Handle send OTP
  const handleSendOtp = () => {
    if (mobileNumber === '91874498') {
      setOtpSent(true);
      toast.success('OTP sent to your mobile number');
    } else {
      toast.error('Invalid mobile number. For testing, use: 91874498');
    }
  };

  const handleOtpComplete = useCallback((otp: string) => {
    if (otp === '123456') {
      try {
        setLoading(true);
        // Create a user object with the mobile number
        const userData = {
          id: mobileNumber,
          phone: mobileNumber,
          role: 'regular' as const,
          firstName: 'Test',
          lastName: 'User',
          email: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          bookings: [],
        };

        // Update user context
        userDispatch({
          type: 'SET_USER',
          payload: userData
        });

        // Store in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userData));

        toast.success('Login successful!');
        onClose();
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Invalid OTP. For testing, use: 123456');
    }
  }, [mobileNumber, userDispatch, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6 max-w-sm mx-auto">
              Sign in with your mobile number
            </p>
            
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm 
                             text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!showOtpButton || loading}
                  className="w-full py-2 px-4 rounded-lg font-medium
                           bg-gradient-to-r from-[#FFD700] to-[#FFA500]
                           text-gray-900 shadow-lg
                           hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]
                           transform hover:-translate-y-0.5
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:transform-none disabled:hover:shadow-none"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 text-center">
                  Enter the 6-digit code sent to your mobile number
                </p>
                <OTPInput
                  onComplete={handleOtpComplete}
                  isLoading={loading}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
