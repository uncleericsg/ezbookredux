import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setToken } from '../store/slices/authSlice';
import { setUser } from '../store/slices/userSlice';
import { OTPInput } from './common/OTPInput';
import { FiX, FiPhone } from 'react-icons/fi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setShowOtpInput(false);
      setPhoneNumber('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 8) {
      setShowOtpInput(true);
      toast.success('OTP sent! Use code: 123456');
    } else {
      toast.error('Please enter a valid phone number');
    }
  };

  const handleOtpVerification = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Mock user data
      const mockUser = {
        id: '1',
        name: 'Test User',
        phone: phoneNumber,
        role: 'user',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockToken = 'mock-jwt-token';

      // Store in localStorage first
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      // Update Redux state
      dispatch(setToken(mockToken));
      dispatch(setUser(mockUser));
      dispatch(setAuthenticated(true));

      // Close modal and navigate
      onClose();
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate, onClose, phoneNumber]);

  const handleOtpComplete = (otp: string) => {
    if (otp === '123456') {
      handleOtpVerification();
    } else {
      toast.error('Invalid OTP code');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg p-6 bg-gray-900 rounded-xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Sign In Screen */}
            {!showOtpInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent">
                  Sign In
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-400 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      onKeyPress={(e) => e.key === 'Enter' && handlePhoneSubmit(e)}
                      placeholder="Enter your mobile number"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                      disabled={isLoading}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      For testing, use: 91874498
                    </div>
                  </div>
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={phoneNumber.length < 8 || isLoading}
                    className="w-full py-2 px-4 bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? 'Sending...' : 'Continue'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* OTP Screen */}
            {showOtpInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent">
                  Enter OTP
                </h2>
                <p className="text-gray-400">Enter the 6-digit code sent to your mobile number</p>
                <OTPInput
                  length={6}
                  onComplete={handleOtpComplete}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
