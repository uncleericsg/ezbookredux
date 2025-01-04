import React, { lazy, Suspense, useState, useCallback } from 'react';
import './styles/CustomerForm.css';
import { useScrollToTop } from '@hooks/useScrollToTop';
import { useFormValidation } from './hooks/useFormValidation';
import { useAddressAutocomplete } from './hooks/useAddressAutocomplete';
import { useMobileVerification } from './hooks/useMobileVerification';
import type { CustomerFormData, CustomerFormProps, FormValidation } from './types/index';

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

  // Mobile verification
  const { validationState, handleVerifyMobile: verifyMobile, handleVerifyOTP } = useMobileVerification({
    onVerificationComplete: () => {
      // Focus address field after verification
      setTimeout(() => {
        document.getElementById('address')?.focus();
      }, 100);
    }
  });

  // Address autocomplete
  const { isGoogleMapsLoaded, inputRef, handleInputBlur } = useAddressAutocomplete({
    onAddressSelect: (addressData) => {
      setFormData((prev: CustomerFormData) => ({
        ...prev,
        blockStreet: addressData.blockStreet,
        postalCode: addressData.postalCode
      }));
      updateValidation('address', addressData.blockStreet);
      updateValidation('postalCode', addressData.postalCode);
      // Focus unit field after address selection
      setTimeout(() => {
        document.getElementById('unit')?.focus();
      }, 100);
    }
  });

  // Input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: CustomerFormData) => ({ ...prev, [name]: value }));
    updateValidation(name, value);
  }, [updateValidation]);

  // Mobile verification handler
  const handleVerifyMobile = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer || !formData.mobile) return;
    verifyMobile(formData.mobile, 'recaptcha-container');
  }, [formData.mobile, verifyMobile]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    try {
      onSave(formData);
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isFormValid, onSave]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
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
          />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-800 rounded-lg"></div>}>
          <AddressSection
            formData={formData}
            validation={validation}
            isGoogleMapsLoaded={isGoogleMapsLoaded}
            onInputChange={handleInputChange}
            onBlur={handleInputBlur}
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
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all duration-300 relative ${
              isFormValid()
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
      </form>
    </div>
  );
};

export default CustomerForm;