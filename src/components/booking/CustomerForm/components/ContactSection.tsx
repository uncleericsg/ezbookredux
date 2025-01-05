import React from 'react';
import { FiMail, FiPhone, FiCheck, FiX } from 'react-icons/fi';
import type { ContactSectionProps } from '../types';
import { EmailSuggestion } from '@utils/emailUtils';

const ContactSection: React.FC<ContactSectionProps> = ({
  formData,
  validation,
  validationState,
  onInputChange,
  onBlur,
  onVerifyMobile,
  onVerifyOTP,
  emailSuggestion,
  onSuggestionClick
}) => {
  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3" />
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
            />
            {validation.email.touched && (
              <div className={`validation-icon ${validation.email.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.email.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {emailSuggestion && (
            <div className="mt-1">
              <p className="text-yellow-400 text-sm">
                Did you mean{' '}
                <button
                  type="button"
                  onClick={onSuggestionClick}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {emailSuggestion.full}
                </button>
                ?
              </p>
            </div>
          )}
          {validation.email.touched && !validation.email.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.email.error}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mobile" className="form-label">
            Mobile Number
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3" />
            <input
              type="tel"
              id="mobile"
              name="mobile"
              required
              value={formData.mobile}
              onChange={onInputChange}
              onBlur={onBlur}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && validation.mobile.valid && !validationState.showOTPInput && !validationState.isMobileVerified) {
                  e.preventDefault();
                  onVerifyMobile(e);
                }
              }}
              className="form-input"
              disabled={validationState.showOTPInput || validationState.isMobileVerified}
            />
            {validation.mobile.touched && !validationState.showOTPInput && (
              <div className={`validation-icon ${validation.mobile.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.mobile.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.mobile.touched && !validation.mobile.valid && !validationState.showOTPInput && (
            <div className="text-red-500 text-xs mt-1">{validation.mobile.error}</div>
          )}
          {!validationState.showOTPInput && !validationState.isMobileVerified && validation.mobile.valid && (
            <button
              type="button"
              onClick={onVerifyMobile}
              disabled={validationState.isValidating}
              className="submit-button mt-2"
            >
              {validationState.isValidating ? 'Sending...' : 'Verify Mobile'}
            </button>
          )}
          {validationState.showOTPInput && (
            <div className="mt-4">
              <div id="recaptcha-container"></div>
              <div className="otp-input-container">
                {/* OTP Input will be rendered here by the parent component */}
              </div>
            </div>
          )}
          {validationState.isMobileVerified && (
            <div className="text-green-500 text-xs mt-1 flex items-center gap-2">
              <FiCheck className="h-4 w-4" />
              Mobile verified
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;