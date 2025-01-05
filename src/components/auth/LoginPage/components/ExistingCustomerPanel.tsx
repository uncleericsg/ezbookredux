import React from 'react';
import { motion } from 'framer-motion';
import { useLoginFlow } from '../hooks/useLoginFlow';

export const ExistingCustomerPanel: React.FC = () => {
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
  } = useLoginFlow();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 bg-gray-800/50 border border-gray-700/70 rounded-xl backdrop-blur-sm h-full"
    >
      <div className="mb-6">
        <h2 
          id="returning-customer-title"
          className="text-xl font-bold text-[#FFD700] text-center mb-2"
        >
          Welcome Back!
        </h2>
        <p className="text-gray-100 text-center text-sm">
          Return Customer, please sign-in here!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4"
        aria-label="Customer login form"
        noValidate
      >
        <div role="group" aria-labelledby="mobile-input-label">
          <label 
            id="mobile-input-label"
            htmlFor="mobile" 
            className="block text-sm font-medium text-gray-300 text-center mb-2"
          >
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
            className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#FFD700] focus:border-[#FFD700] sm:text-sm"
            placeholder="Enter 8 digit mobile number"
            aria-required="true"
            aria-invalid={mobileNumber.length > 0 && mobileNumber.length !== 8}
            aria-describedby=""
          />
        </div>

        {showOtpButton && !otpSent && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full flex justify-center py-3 px-6 text-base font-medium text-gray-900 bg-[#FFD700] rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] focus:ring-offset-gray-900 disabled:opacity-50"
            aria-label="Send one-time password to your mobile"
          >
            Send OTP
          </motion.button>
        )}

        {otpSent && (
          <div role="group" aria-labelledby="otp-input-label">
            <label 
              id="otp-input-label"
              htmlFor="otp" 
              className="block text-sm font-medium text-gray-300"
            >
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
              className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#FFD700] focus:border-[#FFD700] sm:text-sm"
              placeholder="Enter 6-digit OTP"
              autoFocus
              aria-required="true"
              aria-invalid={otp.length > 0 && otp.length !== 6}
              aria-describedby="otp-hint"
            />
            <p id="otp-hint" className="mt-1 text-xs text-gray-400">
              Enter the 6-digit code sent to your mobile
            </p>
          </div>
        )}

        {otpSent && (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="font-medium text-[#FFD700] hover:text-yellow-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Request a new one-time password"
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
              className="w-full flex justify-center py-3 px-6 text-base font-medium text-gray-900 bg-[#FFD700] rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] focus:ring-offset-gray-900 disabled:opacity-50"
              aria-label={loading ? 'Verifying your one-time password' : 'Verify one-time password'}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </motion.button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default ExistingCustomerPanel;