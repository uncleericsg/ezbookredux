import React, { useRef } from 'react';
import { FiMail, FiPhone, FiCheck } from 'react-icons/fi';
import { OTPInput } from '@components/common/OTPInput';
import type { ContactSectionProps } from '../types';

const ContactSection: React.FC<ContactSectionProps> = ({
  formData,
  validation,
  validationState,
  onInputChange,
  onBlur,
  onVerifyMobile,
  onVerifyOTP
}) => {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const handleVerifyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recaptchaContainerRef.current) return;
    onVerifyMobile(e);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && validation.mobile.valid && !validationState.showOTPInput && !validationState.isMobileVerified) {
      e.preventDefault();
      handleVerifyClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
          Email Address
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.email.touched
                ? validation.email.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your email address"
          />
        </div>
        {validation.email.touched && !validation.email.valid && (
          <p className="mt-2 text-sm text-red-500">{validation.email.error}</p>
        )}
      </div>

      <div className="relative">
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-200 mb-2">
          Mobile Number
        </label>
        <div className="relative">
          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            id="mobile"
            name="mobile"
            required
            value={formData.mobile}
            onChange={onInputChange}
            onBlur={onBlur}
            onKeyPress={handleKeyPress}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.mobile.touched
                ? validation.mobile.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={validationState.showOTPInput || validationState.isMobileVerified}
          />
        </div>
        {validation.mobile.touched && !validation.mobile.valid && !validationState.showOTPInput && (
          <p className="mt-2 text-sm text-red-500">{validation.mobile.error}</p>
        )}
        {!validationState.showOTPInput && !validationState.isMobileVerified && validation.mobile.valid && (
          <button
            type="button"
            onClick={handleVerifyClick}
            disabled={validationState.isValidating}
            className="mt-2 w-full py-2 px-4 rounded-lg font-medium
                     bg-gradient-to-r from-[#FFD700] to-[#FFA500]
                     text-gray-900 shadow-lg
                     hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]
                     transform hover:-translate-y-0.5
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     disabled:transform-none disabled:hover:shadow-none"
          >
            {validationState.isValidating ? 'Sending...' : 'Verify Mobile'}
          </button>
        )}
        <div className="mt-2">
          {validationState.showOTPInput && (
            <>
              <OTPInput
                length={6}
                onComplete={onVerifyOTP}
                error={validationState.otpError}
              />
              {validationState.otpError && (
                <p className="mt-2 text-sm text-red-500">{validationState.otpError}</p>
              )}
            </>
          )}
          {validationState.isMobileVerified && (
            <div className="text-green-500 text-sm mt-1 flex items-center gap-2">
              <FiCheck className="h-4 w-4" />
              Mobile verified
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </div>
  );
};

export default ContactSection;