import { useState } from 'react';
import { firebaseValidation } from '../services/validation/firebaseValidation';

interface ValidationState {
  isValidating: boolean;
  showOTPInput: boolean;
  verificationId: string;
  otpError: string;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  emailError: string;
}

export const useFirebaseValidation = () => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    showOTPInput: false,
    verificationId: '',
    otpError: '',
    isMobileVerified: false,
    isEmailVerified: false,
    emailError: ''
  });

  const validateEmail = async (email: string) => {
    setValidationState(prev => ({ 
      ...prev, 
      isValidating: true, 
      emailError: '',
      isEmailVerified: false 
    }));

    const result = await firebaseValidation.validateEmail(email);
    
    setValidationState(prev => ({ 
      ...prev, 
      isValidating: false,
      isEmailVerified: result.isValid,
      emailError: result.error || ''
    }));
    return result;
  };

  const resetEmailValidation = () => {
    setValidationState(prev => ({
      ...prev,
      isEmailVerified: false,
      emailError: ''
    }));
  };

  const sendOTP = async (phoneNumber: string, recaptchaContainerId: string) => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    const result = await firebaseValidation.sendOTP(phoneNumber, recaptchaContainerId);
    
    if (result.isValid && result.verificationId) {
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        showOTPInput: true,
        verificationId: result.verificationId
      }));
    } else {
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        otpError: result.error || ''
      }));
    }
    return result;
  };

  const verifyOTP = async (code: string) => {
    if (!validationState.verificationId) {
      return { isValid: false, error: 'No verification ID found' };
    }

    setValidationState(prev => ({ ...prev, isValidating: true }));
    const result = await firebaseValidation.verifyOTP(validationState.verificationId, code);
    
    if (result.isValid) {
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        showOTPInput: false,
        isMobileVerified: true
      }));
    } else {
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        otpError: result.error || ''
      }));
    }
    return result;
  };

  const resetValidation = () => {
    setValidationState({
      isValidating: false,
      showOTPInput: false,
      verificationId: '',
      otpError: '',
      isMobileVerified: false,
      isEmailVerified: false,
      emailError: ''
    });
    firebaseValidation.clearRecaptcha();
  };

  return {
    validationState,
    validateEmail,
    sendOTP,
    verifyOTP,
    resetValidation,
    resetEmailValidation
  };
};
