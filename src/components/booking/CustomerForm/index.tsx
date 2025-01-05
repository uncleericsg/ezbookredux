import React, { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react';
import './styles/CustomerForm.css';
import { useScrollToTop } from '@hooks/useScrollToTop';
import { useFormValidation } from './hooks/useFormValidation';
import { useMobileVerification } from './hooks/useMobileVerification';
import { findEmailTypo, EmailSuggestion } from '@utils/emailUtils';
import { FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import ExistingUserModal from './components/ExistingUserModal';
import type { CustomerFormData, CustomerFormProps } from './types/index';

// Lazy load form sections
const PersonalInfoSection = lazy(() => import('./components/PersonalInfoSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const AddressSection = lazy(() => import('./components/AddressSection'));
const OptionalSection = lazy(() => import('./components/OptionalSection'));

const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, user, isAMC = false }) => {
  // Initialize scroll to top
  const scrollToTop = useScrollToTop([]);

  // Form state
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    blockStreet: user?.addresses?.[0]?.blockStreet || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    floorUnit: user?.addresses?.[0]?.floorUnit || '',
    condoName: user?.addresses?.[0]?.condoName || '',
    lobbyTower: user?.addresses?.[0]?.lobbyTower || '',
    specialInstructions: ''
  });

  // Form validation
  const { validation, updateValidation, isFormValid } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExistingUserModal, setShowExistingUserModal] = useState(false);
  const [modalType, setModalType] = useState<'email' | 'mobile'>('email');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [existingUserEmail, setExistingUserEmail] = useState<string | null>(null);
  const [existingUserMobile, setExistingUserMobile] = useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<EmailSuggestion | null>(null);
  const emailCheckTimerRef = useRef<NodeJS.Timeout>();
  const mobileCheckTimerRef = useRef<NodeJS.Timeout>();

  // Mobile verification
  const { validationState, handleVerifyMobile: verifyMobile, handleVerifyOTP } = useMobileVerification({
    onVerificationComplete: () => {
      // Focus address field after verification
      setTimeout(() => {
        document.getElementById('address')?.focus();
      }, 100);
    }
  });

  // Check if form is ready to submit
  const canSubmit = useCallback(() => {
    return isFormValid() && validationState.isMobileVerified;
  }, [isFormValid, validationState.isMobileVerified]);

  const checkExistingEmail = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) return false;
    
    try {
      setIsCheckingUser(true);
      // Simulate existing user check - replace with actual API call
      const existingUser = false; // TODO: Implement actual check
      
      if (existingUser) {
        setExistingUserEmail(email);
        setModalType('email');
        setShowExistingUserModal(true);
        setEmailSuggestion(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    } finally {
      setIsCheckingUser(false);
    }
  }, []);

  const checkExistingMobile = useCallback(async (mobile: string) => {
    if (!mobile || mobile.length < 8) return false;
    
    try {
      setIsCheckingUser(true);
      // Simulate existing user check - replace with actual API call
      const existingUser = false; // TODO: Implement actual check
      
      if (existingUser) {
        setExistingUserMobile(mobile);
        setModalType('mobile');
        setShowExistingUserModal(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking mobile:', error);
      return false;
    } finally {
      setIsCheckingUser(false);
    }
  }, []);

  // Input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for mobile number
    if (name === 'mobile') {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      const formattedValue = digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits;
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      updateValidation(name, formattedValue);

      // Debounce mobile check
      if (mobileCheckTimerRef.current) {
        clearTimeout(mobileCheckTimerRef.current);
      }
      mobileCheckTimerRef.current = setTimeout(() => {
        checkExistingMobile(formattedValue);
      }, 500);
      return;
    }

    // Special handling for email
    if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      const fieldValidation = updateValidation(name, value);

      // Check for typos in email
      const suggestion = findEmailTypo(value);
      setEmailSuggestion(suggestion);

      // Debounce email check - only if no typo suggestion exists
      if (emailCheckTimerRef.current) {
        clearTimeout(emailCheckTimerRef.current);
      }
      emailCheckTimerRef.current = setTimeout(() => {
        if (fieldValidation.valid && !suggestion) {
          checkExistingEmail(value);
        }
      }, 500);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    updateValidation(name, value);
  }, [updateValidation, checkExistingEmail, checkExistingMobile]);

  const handleSuggestionClick = useCallback(() => {
    if (emailSuggestion) {
      setFormData(prev => ({ ...prev, email: emailSuggestion.full }));
      setEmailSuggestion(null);
      updateValidation('email', emailSuggestion.full);
    }
  }, [emailSuggestion, updateValidation]);

  // Mobile verification handler
  const handleVerifyMobile = useCallback((e: React.MouseEvent<Element> | React.KeyboardEvent<Element>) => {
    e.preventDefault();
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer || !formData.mobile) return;
    verifyMobile(formData.mobile, 'recaptcha-container');
  }, [formData.mobile, verifyMobile]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;
    
    setIsSubmitting(true);
    try {
      onSave(formData);
      toast.success('Customer information saved successfully!');
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save customer information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, canSubmit, onSave]);

  // Initialize validation for pre-filled fields
  useEffect(() => {
    if (user) {
      if (user.firstName) updateValidation('firstName', user.firstName);
      if (user.lastName) updateValidation('lastName', user.lastName);
      if (user.email) updateValidation('email', user.email);
      if (user.mobile) updateValidation('mobile', user.mobile);
      if (user.addresses?.[0]?.blockStreet) updateValidation('blockStreet', user.addresses[0].blockStreet);
      if (user.addresses?.[0]?.postalCode) updateValidation('postalCode', user.addresses[0].postalCode);
      if (user.addresses?.[0]?.floorUnit) updateValidation('floorUnit', user.addresses[0].floorUnit);
    }
  }, [user, updateValidation]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="form-header">Customer Information</div>
        <div className="form-description">
          Please fill in your details for the booking
        </div>

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
              <FiLoader className="animate-spin h-6 w-6 text-blue-500" />
              <span className="text-white">Submitting your booking...</span>
            </div>
          </div>
        )}

        <Suspense fallback={<div className="animate-pulse h-24 bg-gray-800 rounded-lg"></div>}>
          <PersonalInfoSection
            formData={formData}
            validation={validation}
            onInputChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-800 rounded-lg"></div>}>
          <ContactSection
            formData={formData}
            validation={validation}
            validationState={validationState}
            onInputChange={handleInputChange}
            onBlur={handleInputChange}
            onVerifyMobile={handleVerifyMobile}
            onVerifyOTP={handleVerifyOTP}
            emailSuggestion={emailSuggestion}
            onSuggestionClick={handleSuggestionClick}
          />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-800 rounded-lg"></div>}>
          <AddressSection
            formData={formData}
            validation={validation}
            onInputChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-24 bg-gray-800 rounded-lg"></div>}>
          <OptionalSection
            formData={formData}
            validation={validation}
            onInputChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </Suspense>

        <div className="form-button-container">
          <button
            type="submit"
            disabled={!canSubmit() || isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all duration-300 relative ${
              canSubmit()
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900 shadow-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transform hover:-translate-y-0.5'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>
              Continue
            </span>
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </button>
        </div>
        <div id="recaptcha-container"></div>
      </form>

      <ExistingUserModal
        isOpen={showExistingUserModal}
        onClose={() => setShowExistingUserModal(false)}
        userEmail={existingUserEmail || undefined}
        userMobile={existingUserMobile || undefined}
        type={modalType}
      />
    </div>
  );
};

export default CustomerForm;