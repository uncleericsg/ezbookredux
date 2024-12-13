import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { OTPInput } from './common/OTPInput';
import { useAppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';
import { setAuthenticated, setToken, setLoading } from '../store/slices/authSlice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleOtpVerification = () => {
    // Mock successful OTP verification
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = {
      id: '12345',
      phone: mobileNumber,
      role: 'regular',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookings: [],
      notifications: [],
      preferences: {
        language: 'en',
        theme: 'dark',
        notifications: true
      }
    };

    try {
      // First update localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Then update Redux state in correct order
      dispatch(setToken(mockToken));
      dispatch(setUser(mockUser));
      dispatch(setAuthenticated(true));
      dispatch(setLoading(false));

      toast.success('Login successful!');
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      dispatch(setLoading(false));
    }
  };

  const handleOtpComplete = useCallback((otp: string) => {
    if (otp === '123456') {
      setLoading(true);
      handleOtpVerification();
    } else {
      toast.error('Invalid OTP. For testing, use: 123456');
    }
  }, [mobileNumber, dispatch, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {otpSent ? 'Enter OTP' : 'Login'}
          </h2>

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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your mobile number"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">For testing, use: 91874498</p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={!showOtpButton || loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
                  ${showOtpButton && !loading
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                  }`}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <OTPInput
                length={6}
                onComplete={handleOtpComplete}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 text-center">For testing, use: 123456</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
