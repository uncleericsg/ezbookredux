import React from 'react';
import { motion } from 'framer-motion';
import { useOtpVerification } from './hooks';

interface LoginPanelProps {
  className?: string;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ className }) => {
  const {
    mobileNumber,
    otp,
    loading,
    showOtpButton,
    otpSent,
    handleMobileNumberChange,
    handleOtpChange,
    handleSendOtp,
    handleSubmit
  } = useOtpVerification();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-gray-800/50 border border-gray-700/70 rounded-xl backdrop-blur-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#FFD700] text-center mb-2">
          Welcome Back!
        </h3>
        <p className="text-gray-100 text-center text-sm">
          Return Customer, please sign-in here!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 text-center mb-4">
            Mobile Number
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            maxLength={8}
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#FFD700] focus:border-[#FFD700] sm:text-sm"
            placeholder="Enter 8 digit mobile number"
          />
        </div>

        {showOtpButton && !otpSent && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-[#FFD700] rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] focus:ring-offset-gray-900 disabled:opacity-50"
          >
            Send OTP
          </motion.button>
        )}

        {otpSent && (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
              One Time Password
            </label>
            <input
              id="otp"
              name="otp"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#FFD700] focus:border-[#FFD700] sm:text-sm"
              placeholder="Enter 6-digit OTP"
              autoFocus
            />
          </div>
        )}

        {otpSent && (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="font-medium text-[#FFD700] hover:text-yellow-500 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {otpSent && (
          <div>
            <motion.button
              whileTap={{ y: 1 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-[#FFD700] rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </motion.button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default LoginPanel;