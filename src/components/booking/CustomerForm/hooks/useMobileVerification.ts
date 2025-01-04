import { useState, useCallback } from 'react';
import { useFirebaseValidation } from '@hooks/useFirebaseValidation';

interface ValidationState {
  showOTPInput: boolean;
  isMobileVerified: boolean;
  isValidating: boolean;
  otpError?: string;
}

interface UseMobileVerificationProps {
  onVerificationComplete?: () => void;
}

export const useMobileVerification = ({ onVerificationComplete }: UseMobileVerificationProps = {}) => {
  const {
    validationState: firebaseState,
    sendOTP,
    verifyOTP,
    resetValidation
  } = useFirebaseValidation();

  const [validationState, setValidationState] = useState<ValidationState>({
    showOTPInput: false,
    isMobileVerified: false,
    isValidating: false,
    otpError: undefined
  });

  const handleVerifyMobile = useCallback(async (mobile: string, recaptchaContainerId: string) => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const result = await sendOTP(mobile, recaptchaContainerId);
      if (result.isValid) {
        setValidationState(prev => ({
          ...prev,
          showOTPInput: true,
          isValidating: false,
          otpError: undefined
        }));
        return { isValid: true };
      } else {
        setValidationState(prev => ({
          ...prev,
          isValidating: false,
          otpError: result.error
        }));
        return { isValid: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        otpError: errorMessage
      }));
      return { isValid: false, error: errorMessage };
    }
  }, [sendOTP]);

  const handleVerifyOTP = useCallback(async (code: string) => {
    setValidationState(prev => ({ ...prev, isValidating: true }));

    try {
      const result = await verifyOTP(code);
      if (result.isValid) {
        setValidationState(prev => ({
          ...prev,
          isMobileVerified: true,
          showOTPInput: false,
          isValidating: false,
          otpError: undefined
        }));
        onVerificationComplete?.();
        return { isValid: true };
      } else {
        setValidationState(prev => ({
          ...prev,
          isValidating: false,
          otpError: result.error
        }));
        return { isValid: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        otpError: errorMessage
      }));
      return { isValid: false, error: errorMessage };
    }
  }, [verifyOTP, onVerificationComplete]);

  const resetMobileValidation = useCallback(() => {
    setValidationState({
      showOTPInput: false,
      isMobileVerified: false,
      isValidating: false,
      otpError: undefined
    });
    resetValidation();
  }, [resetValidation]);

  return {
    validationState: {
      ...validationState,
      ...firebaseState
    },
    handleVerifyMobile,
    handleVerifyOTP,
    resetMobileValidation
  };
};

export default useMobileVerification;