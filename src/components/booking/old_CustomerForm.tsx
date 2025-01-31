import React, { useState, useEffect, useRef } from 'react';

"use client";
/*;
 * @ai-protection - DO NOT MODIFY THIS FILE;
 * This is a stable version of the customer form component that handles: any;,
 * 1. User information collection and validation;
 * 2. Mobile number verification with Firebase OTP;
 * 3. Address autocomplete with Google Places API;
 * 4. Form state management and validation;
 * 5. Auto-focus behavior for improved UX;
 *;
 * Critical Features: any;,
 * - Mobile OTP verification flow;
 * - Address validation and autocomplete;
 * - Email validation with typo detection;
 * - Form validation and error handling;
 * - Auto-focus behavior after OTP and address selection;
 *;
 * Integration Points: any;,
 * - Firebase Authentication for OTP;
 * - Google Places API for address;
 * - Email validation service;
 * - Booking service;
 *;
 * @ai-visual-protection: any;,
 * @ai-flow-protection: any;,
 * @ai-state-protection: any;,
 *;
 * Any modifications to this component could affect: any;,
 * 1. User authentication flow;
 * 2. Booking process;
 * 3. Address validation;
 * 4. Form validation;
 *;
 * If changes are needed: any;,
 * 1. Create a detailed proposal;
 * 2. Test thoroughly in development;
 * 3. Verify all integrations still work;
 * 4. Ensure no regression in form validation;
 */;
import './CustomerForm.css';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiHash, FiBox, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useFirebaseValidation } from '../../hooks/useFirebaseValidation';
import { OTPInput } from '../common/OTPInput';
import { findEmailTypo, EmailSuggestion } from '../../utils/emailUtils';
import { createBooking } from '../../services/bookingService';
import { supabase } from '../../lib/supabase';
import { profileService } from '../../services/supabase/profileService';
import { bookingService } from '../../services/supabase/bookingService';
import { toast } from 'react-hot-toast';
import ExistingUserModal from './ExistingUserModal';

export interface CustomerFormData;

export interface ValidationState;

export interface FormValidation;

export interface CustomerFormProps;

export interface Window;

export interface handleSuggestionClickProps;

export interface handleGoogleMapsLoadedProps;

export interface initializeAutocompleteProps;

export interface handlePlaceSelectProps;

export interface renderValidationIconProps;


  firstName: string;, lastName: any;,
  email: string;, mobile: any;,
  address: string;, postalCode: any;,
  unit: string;, buildingName: any;,
  lobbyTower: };

  touched: boolean;, valid: any;,
  error?: string
};

  firstName: ValidationState;, lastName: any;,
  email: ValidationState;, mobile: any;,
  address: ValidationState;, postalCode: any;,
  unit: ValidationState;, buildingName: any;,
  lobbyTower: };

  onSave: (formDat,a: CustomerFormData & {  bookingId: string, customerInfo: }) => void;
  user?: {;
    firstName: string;, lastName: any;,
    email: string;, mobile: any;,
    addresses: Array<{ ,id: any;,
      floorUnit: string;, blockStreet: any;,
      postalCode: any;,
      condoName?: string;
      lobbyTower?: string;
      isDefault;
  };
  isAMC?: boolean
};
declare global {;
  interface Window extends React.HTMLAttributes<HTMLDivElement> { {;
    google: any;,
    initMap: any;,
    isGoogleMapsLoaded;
};

export const CustomerForm: any = (props: any;,
  const navigate: any;,
  const [formData, setFormData] = useState<CustomerFormData>({;
    firstName;
    lobbyTower: });
  const [validation, setValidation] = useState<FormValidation>({;
    firstName: { ,touched;
    lastName: { ,touched;
    email: { ,touched;
    mobile: { ,touched;
    address: { ,touched;
    postalCode: { ,touched;
    unit: { ,touched;
    buildingName: { ,touched: false, valid: }, // Optional field;
    lobbyTower: { ,touched;
  });
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const autocompleteRef: any;,
  const inputRef: any;,
  const addressInputRef: any;,
  const unitInputRef: any;,
  const recaptchaContainerRef: any;,
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<EmailSuggestion | null>(null);
  const { ;
    validationState,
    validateEmail,
    sendOTP,
    verifyOTP,
    resetValidation,
    resetEmailValidation
  } = useFirebaseValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExistingUserModal, setShowExistingUserModal] = useState(false);
  const [modalType, setModalType] = useState<'email' | 'mobile'>('email');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [existingUserEmail, setExistingUserEmail] = useState<string | null>(null);
  const [existingUserMobile, setExistingUserMobile] = useState<string | null>(null);
  const emailCheckTimerRef: any;,
  const mobileCheckTimerRef: any;,
  const formatMobileNumber: any = (value: any;,
    const digits: any = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 4) {
   {
}
   {
}
   {
}
   {
}
      return `${digits.slice(0, 4)} ${digits.slice(4)}`
    };
    return digits
  };
  const validateField: any = (name: string, value: any;,
    switch (name) {;
      case 'firstName': any;
      case 'lastName': any;
        return {;
          touched;
          error: };
      case 'email': {;
        const emailRegex: any = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2}$/;
        const isValidFormat: any;,
        return {;
          touched;
      };
      case 'mobile': any;
        const digitsOnly: any = value.replace(/\D/g, '');
        const mobileRegex: 7}$/;
        return {;
          touched;
          error: };
      case 'address': any;
        return {;
          touched;
          error: };
      case 'postalCode': any;
        const postalRegex: 6}$/;
        return {;
          touched;
          error: };
      case 'unit': any;
        return {;
          touched;
          error: };
      case 'buildingName': any;
      case 'lobbyTower': any;
        return {;
          touched;
          valid: };
      ,default: any;,
        return {  touched;
  };
  const isFormValid: any;,
    const requiredFields: any = ['firstName', 'lastName', 'email', 'mobile', 'address', 'postalCode', 'unit'];
    return requiredFields.every(field => validation[field as keyof FormValidation].valid)
  };
  const handleInputChange: any = async (e: any;,
    const { name, value } = e.target;
    // Special handling for mobile number;
    if (name === 'mobile') {
   {
}
   {
}
   {
}
   {
}
      const formattedValue: any;,
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      setValidation(prev => ({;
        ...prev,
        [name]: validateField(name, formattedValue)
      }));
      // Debounce mobile check;
      if (mobileCheckTimerRef.current) {
   {
}
   {
}
   {
}
   {
}
        clearTimeout(mobileCheckTimerRef.current)
      };
      mobileCheckTimerRef.current = setTimeout((): (any): (any): (any): (any) => {;
        checkExistingMobile(formattedValue)
      }, 500);
      return
    };
    // Special handling for email;
    if (name === 'email') {
   {
}
   {
}
   {
}
   {
}
      setFormData(prev => ({ ...prev, [name]: value }));
      const fieldValidation: any = validateField(name, value);
      setValidation(prev => ({;
        ...prev,
        [name]: fieldValidation
      }));
      // Check for typos in email;
      const suggestion: any;,
      setEmailSuggestion(suggestion);
      // Debounce email check - only if no typo suggestion exists;
      if (emailCheckTimerRef.current) {
   {
}
   {
}
   {
}
   {
}
        clearTimeout(emailCheckTimerRef.current)
      };
      emailCheckTimerRef.current = setTimeout((): (any): (any): (any): (any) => {;
        if (fieldValidation.valid && !suggestion) {
   {
}
   {
}
   {
}
   {
}
          checkExistingEmail(value)
        }
      }, 500);
      return
    };
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidation(prev => ({;
      ...prev,
      [name]: validateField(name, value)
    }))
  };
  const checkExistingEmail: any = async (email: any;,
    if (!email || !email.includes('@') {
   {
}
   {
}
   {
}
  ) return
}
    try {;
      setIsCheckingUser(true);
      const {  data: } = await supabase;
        .from('profiles');
        .select('email');
        .eq('email', email);
        .single();
      if (existingUser) {
   {
}
   {
}
   {
}
   {
}
        setExistingUserEmail(email);
        setModalType('email');
        setShowExistingUserModal(true);
        // Clear any email suggestions when an existing user is found;
        setEmailSuggestion(null);
        return true
      };
      return false
    } catch (error) {;
      console.error('Error checking email: ', error);
      return false
    } finally {;
      setIsCheckingUser(false)
    }
  };
  const checkExistingMobile: any = async (mobile: any;,
    if (!mobile || mobile.length < 8) {
   {
}
   {
}
   {
}
  return
}
    try {;
      setIsCheckingUser(true);
      const {  data: } = await supabase;
        .from('profiles');
        .select('mobile');
        .eq('mobile', mobile);
        .single();
      if (existingUser) {
   {
}
   {
}
   {
}
   {
}
        setExistingUserMobile(mobile);
        setModalType('mobile');
        setShowExistingUserModal(true);
        return true
      };
      return false
    } catch (error) {;
      console.error('Error checking mobile: ', error);
      return false
    } finally {;
      setIsCheckingUser(false)
    }
  };
  interface handleSuggestionClickProps extends React.HTMLAttributes<HTMLDivElement> { {};
      setEmailSuggestion(null);
      // Trigger validation for the corrected email;
      validateEmail(emailSuggestion.full)
    };
  const handleVerifyMobile: any = async (e: any;,
    e.preventDefault(); // Prevent form submission;
    if (!recaptchaContainerRef.current) {
   {
}
   {
}
   {
}
  return
}
    const result: any = await sendOTP(formData.mobile, 'recaptcha-container');
    if (!result.isValid) {
   {
}
   {
}
   {
}
   {
}
      setValidation(prev => ({;
        ...prev,
        mobile: { ,touched;
  };
  const handleVerifyOTP: any = async (code: any;,
    try {;
      const result: any;,
      if (result.isValid) {
   {
}
   {
}
   {
}
   {
}
        // Focus on the next field after successful verification;
        setTimeout((): (any): (any): (any): (any) => {;
          addressInputRef.current?.focus()
        }, 100)
      }
    } catch (error) {;
      console.error('OTP verification error;
  };
  const handleBlur: any = async (e: any;,
    const { name, value } = e.target;
    const fieldValidation: any = validateField(name, value);
    setValidation(prev => ({;
      ...prev,
      [name]: fieldValidation
    }));
    // Handle email validation on blur;
    if (name === 'email') {
   {
}
   {
}
   {
}
   {
}
      if (!fieldValidation.valid) {
   {
}
   {
}
   {
}
   {
}
        // Reset Firebase email validation if format is invalid;
        resetEmailValidation()
      } else {
  if (value) {
   {
}
   {
}
   {
}
}
   {
}
        // Only proceed with Firebase validation if format is valid;
        const firebaseResult: any;,
        if (!firebaseResult.isValid) {
   {
}
   {
}
   {
}
   {
}
          setValidation(prev => ({;
            ...prev,
            [name]: {  touched;
  };
  useEffect((): (any): (any): (any): (any) => {;
    if (window.google?.maps) {
   {
}
   {
}
   {
}
   {
}
      setIsGoogleMapsLoaded(true);
      initializeAutocomplete()
    } else {;
      interface handleGoogleMapsLoadedProps extends React.HTMLAttributes<HTMLDivElement> { {};
        initializeAutocomplete()
      };
      window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      return (): (any): (any): (any): (any) => {;
        window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded)
      }
    };
  useEffect((): (any): (any): (any): (any) => {;
    return (): (any): (any): (any): (any) => {;
      resetValidation()
    }
  }, []);
  useEffect((): (any): (any): (any): (any) => {;
    if (validationState.isMobileVerified) {
   {
}
   {
}
   {
}
   {
}
      // Focus address field after mobile verification;
      setTimeout((): (any): (any): (any): (any) => {;
        addressInputRef.current?.focus()
      }, 100)
    }
  }, [validationState.isMobileVerified]);
  interface initializeAutocompleteProps extends React.HTMLAttributes<HTMLDivElement> { {};
    autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {;
      componentRestrictions: { ,country;
      types: });
    // Prevent form submission when selecting from autocomplete;
    addressInputRef.current.addEventListener('keydown', (e): (any): (any): (any): (any) => {;
      if (e.key === 'Enter' && document.querySelector('.pac-container: any;,
        e.preventDefault()
      }
    });
    // Prevent the default blur behavior when selecting from autocomplete;
    addressInputRef.current.addEventListener('blur', (e): (any): (any): (any): (any) => {;
      if (document.querySelector('.pac-container') {
   {
}
   {
}
   {
}
  ?.contains(e.relatedTarget as Node)) {
}
        e.preventDefault();
        e.stopPropagation();
        return
      }
    });
    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  interface handlePlaceSelectProps extends React.HTMLAttributes<HTMLDivElement> { {};
    if (!place?.address_components) {
   {
}
   {
}
   {
}
  return
}
    let blockNumber: any;,
    let streetName: any;,
    let postalCode: any;,
    let buildingName: any;,
    // Extract address components;
    place.address_components.forEach((component): (any): (any): (any) => {;
      const types: any;,
      if (types.includes('street_number') {
   {
}
   {
}
   {
}
  ) {
}
        blockNumber = component.long_name
      };
      if (types.includes('route') {
   {
}
   {
}
   {
}
  ) {
}
        streetName = component.long_name
      };
      if (types.includes('postal_code') {
   {
}
   {
}
   {
}
  ) {
}
        postalCode = component.long_name
      };
      // Try to get building name from premise or establishment;
      if (types.includes('premise') {
   {
}
   {
}
   {
}
  || types.includes('establishment')) {
}
        buildingName = component.long_name
      }
    });
    // Format the block and street address;
    const formattedAddress: any;,
      ? `${blockNumber} ${streetName}`;
      : place.name || place.formatted_address?.split(',')[0] || '';
    // Update form data with the extracted information;
    setFormData(prev => ({;
      ...prev,
      address;
      buildingName: }));
    // Update validation;
    setValidation(prev => ({;
      ...prev,
      address;
    }));
    // Focus unit field after address selection;
    setTimeout((): (any): (any): (any): (any) => {;
      unitInputRef.current?.focus()
    }, 100);
  interface renderValidationIconProps extends React.HTMLAttributes<HTMLDivElement> { {};
    if (!field.touched) {
   {
}
   {
}
   {
}
  return null
}
    if (fieldName === 'mobile' && validationState.showOTPInput) {
   {
}
   {
}
   {
}
   {
}
      return null; // Don't show validation icon while OTP verification is in progress
    };
    const commonClasses: any;,
    return field.valid ? (;
      <FiCheck className={`validation-icon ${commonClasses} text-green-400`} />;
    ) : (;
      <FiX className={`validation-icon ${commonClasses} text-red-400`} />;
    );
  const handleSubmit: any = async (e: any;,
    e.preventDefault();
    try {;
      setIsSubmitting(true);
      // First create or get user;
      const {  data: userData, error: } = await supabase.auth.signUp({;
        email;
        options: { ,data: any;,
            first_name;
      });
      if (userError) {
   {
}
   {
}
   {
}
  throw userError
}
      // Get the service category ID for AMC or Regular service;
      const {  data: serviceCategory, error: } = await supabase;
        .from('service_categories');
        .select('id');
        .eq('name', isAMC ? 'AMC' : 'Regular Service');
        .single();
      if (serviceCategoryError) {
   {
}
   {
}
   {
}
  throw serviceCategoryError
}
      // Get default time slot (this should be selected by user in a future update);
      const {  data: timeSlot, error: } = await supabase;
        .from('time_slots');
        .select('id');
        .eq('is_active', true);
        .limit(1);
        .single();
      if (timeSlotError) {
   {
}
   {
}
   {
}
  throw timeSlotError
}
      // Create a new booking;
      const {  data: newBooking, error: } = await supabase;
        .from('bookings');
        .insert([{;
          customer_id;
          booking_date: new Date().toISOString().split('T')[0], // Today's date, should be selected by user in future;
          status;
          price_snapshot: {}, // This should be populated with actual pricing data;
          created_at;
          updated_at: }]);
        .select();
        .single();
      if (bookingError) {
   {
}
   {
}
   {
}
  throw bookingError
}
      // Structure the data to match what PaymentStep expects;
      const bookingData: any;,
        ...formData,
        bookingId;
        customerInfo: { ,firstName;
      };
      onSave(bookingData);
      toast.success('Customer information saved successfully!')
    } catch (error) {;
      console.error('Error creating booking: ', error);
      toast.error('Failed to save customer information. Please try again.')
    } finally {;
      setIsSubmitting(false)
    }
  };
  return (;
    <>;
      <form onSubmit={handleSubmit} className="space-y-6">;
        <div className="form-header">Customer Information</div>;
        <div className="form-description">;
          Please fill in your details for the booking;
        </div>;
        {isSubmitting && (;
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">;
            <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-3">;
              <FiLoader className="animate-spin h-6 w-6 text-blue-500" />;
              <span className="text-white">Submitting your booking...</span>;
            </div>;
          </div>;
        )};
        <div className="form-section">;
          <div className="form-grid">;
            <div className="form-group">;
              <label htmlFor="firstName" className="form-label">;
                First Name;
              </label>;
              <div className="relative">;
                <FiUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="text";
                  id="firstName";
                  name="firstName";
                  required;
                  value={formData.firstName};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                />;
                {renderValidationIcon('firstName')};
                {validation.firstName.touched && !validation.firstName.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.firstName.error}</div>;
                )};
              </div>;
            </div>;
            <div className="form-group">;
              <label htmlFor="lastName" className="form-label">;
                Last Name;
              </label>;
              <div className="relative">;
                <FiUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="text";
                  id="lastName";
                  name="lastName";
                  required;
                  value={formData.lastName};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                />;
                {renderValidationIcon('lastName')};
                {validation.lastName.touched && !validation.lastName.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.lastName.error}</div>;
                )};
              </div>;
            </div>;
            <div className="form-group">;
              <label htmlFor="email" className="form-label">;
                Email;
              </label>;
              <div className="relative">;
                <FiMail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="email";
                  id="email";
                  name="email";
                  required;
                  value={formData.email};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: any;,
                    validationState.emailError ? 'border-red-500' : validationState.isEmailVerified ? 'border-green-500' : ''
                  }`};
                />;
                {renderValidationIcon('email')};
                {emailSuggestion && (;
                  <div className="mt-1 text-sm">;
                    <p className="text-yellow-500">;
                      Did you mean{' '};
                      <button;
                        type="button";
                        onClick={handleSuggestionClick};
                        className="text-blue-400 hover: any;,
                      >;
                        {emailSuggestion.full};
                      </button>;
                      ?;
                    </p>;
                  </div>;
                )};
                {validationState.emailError ? (;
                  <div className="text-red-500 text-xs mt-1">{validationState.emailError}</div>;
                ) : validationState.isEmailVerified ? (;
                  <div className="text-green-500 text-sm mt-1 flex items-center gap-2">;
                    <FiCheck className="h-4 w-4" />;
                    Email verified;
                  </div>;
                ) : validation.email.touched && !validation.email.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.email.error}</div>;
                )};
              </div>;
            </div>;
            <div className="form-group">;
              <label htmlFor="mobile" className="form-label">;
                Mobile Number;
              </label>;
              <div className="relative">;
                <FiPhone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="tel";
                  id="mobile";
                  name="mobile";
                  required;
                  value={formData.mobile};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  onKeyPress={(e): (any): (any): (any): (any) => {;
                    if (e.key === 'Enter' && validation.mobile.valid && !validationState.showOTPInput && !validationState.isMobileVerified) {
   {
}
   {
}
   {
}
   {
}
                      e.preventDefault();
                      handleVerifyMobile(e as any)
                    }
                  }};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                  disabled={validationState.showOTPInput || validationState.isMobileVerified};
                />;
                {renderValidationIcon('mobile')};
              </div>;
              {validation.mobile.touched && !validation.mobile.valid && !validationState.showOTPInput && (;
                <div className="text-red-500 text-xs mt-1">{validation.mobile.error}</div>;
              )};
              {!validationState.showOTPInput && !validationState.isMobileVerified && validation.mobile.valid && (;
                <button;
                  type="button";
                  onClick={handleVerifyMobile};
                  disabled={validationState.isValidating};
                  className="mt-2 w-full py-2 px-4 rounded-lg font-medium;
                           bg-gradient-to-r from-[#FFD700] to-[#FFA500];
                           text-gray-900 shadow-lg;
                           hover: shadow-[0_0_15px_rgba(255,215,0,0.3)];
                           transform hover: any;,
                           transition-all duration-200;
                           disabled: opacity-50, disabled: any;,
                           disabled: transform-none, disabled: any;,
                >;
                  {validationState.isValidating ? 'Sending...' : 'Verify Mobile'};
                </button>;
              )};
              {validationState.showOTPInput && (;
                <div className="mt-2">;
                  <OTPInput;
                    length={6};
                    onComplete={async (code): (any): (any): (any): (any) => {;
                      try {;
                        const result: any;,
                        if (result.isValid) {
   {
}
   {
}
   {
}
   {
}
                          // Focus on the next field after successful verification;
                          setTimeout((): (any): (any): (any): (any) => {;
                            addressInputRef.current?.focus()
                          }, 100)
                        }
                      } catch (error) {;
                        console.error('OTP verification error;
                    }};
                    error={validationState.otpError};
                  />;
                  {validationState.otpError && (;
                    <div className="text-red-500 text-xs mt-1">{validationState.otpError}</div>;
                  )};
                </div>;
              )};
              {validationState.isMobileVerified && (;
                <div className="text-green-500 text-sm mt-1 flex items-center gap-2">;
                  <FiCheck className="h-4 w-4" />;
                  Mobile verified;
                </div>;
              )};
            </div>;
          </div>;
          <div className="form-group">;
            <label htmlFor="address" className="form-label">;
              Address {!isGoogleMapsLoaded && <span className="text-xs text-gray-400">(Loading address search...)</span>};
            </label>;
            <div className="relative">;
              <FiMapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
              <input;
                ref={(el): (any): (any): (any): (any) => {;
                  inputRef.current = el;
                  addressInputRef.current = el
                }};
                type="text";
                id="address";
                name="address";
                required;
                value={formData.address};
                onChange={handleInputChange};
                onBlur={handleBlur};
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                placeholder={!isGoogleMapsLoaded ? "Loading address search..." : ""};
                disabled={!isGoogleMapsLoaded};
              />;
              {renderValidationIcon('address')};
              {validation.address.touched && !validation.address.valid && (;
                <div className="text-red-500 text-xs mt-1">{validation.address.error}</div>;
              )};
            </div>;
          </div>;
          <div className="form-grid">;
            <div className="form-group">;
              <label htmlFor="postalCode" className="form-label">;
                Postal Code;
              </label>;
              <div className="relative">;
                <FiHome className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="text";
                  id="postalCode";
                  name="postalCode";
                  required;
                  value={formData.postalCode};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                  readOnly;
                />;
                {renderValidationIcon('postalCode')};
                {validation.postalCode.touched && !validation.postalCode.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.postalCode.error}</div>;
                )};
              </div>;
            </div>;
            <div className="form-group">;
              <label htmlFor="unit" className="form-label">;
                Unit Number (NA if none);
              </label>;
              <div className="relative">;
                <FiHash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  ref={unitInputRef};
                  type="text";
                  id="unit";
                  name="unit";
                  required;
                  value={formData.unit};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                />;
                {renderValidationIcon('unit')};
                {validation.unit.touched && !validation.unit.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.unit.error}</div>;
                )};
              </div>;
            </div>;
            <div className="form-group">;
              <label htmlFor="buildingName" className="form-label">;
                Condo Name (Optional);
              </label>;
              <div className="relative">;
                <FiHome className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="text";
                  id="buildingName";
                  name="buildingName";
                  value={formData.buildingName};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                />;
                {renderValidationIcon('buildingName')};
                {validation.buildingName.touched && !validation.buildingName.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.buildingName.error}</div>;
                )};
              </div>;
            </div>;
            <div className="form-group">;
              <label htmlFor="lobbyTower" className="form-label">;
                Lobby/Tower (Optional);
              </label>;
              <div className="relative">;
                <FiBox className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />;
                <input;
                  type="text";
                  id="lobbyTower";
                  name="lobbyTower";
                  value={formData.lobbyTower};
                  onChange={handleInputChange};
                  onBlur={handleBlur};
                  className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus: outline-none, focus: ring-2 ,focus: ring-blue-500/50, focus: `};
                />;
                {renderValidationIcon('lobbyTower')};
                {validation.lobbyTower.touched && !validation.lobbyTower.valid && (;
                  <div className="text-red-500 text-xs mt-1">{validation.lobbyTower.error}</div>;
                )};
              </div>;
            </div>;
          </div>;
        </div>;
        <div className="form-button-container">;
          <button;
            type="submit";
            disabled={!isFormValid() || isSubmitting};
            className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all duration-300 ${;
              isFormValid() && !isSubmitting;
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900 shadow-lg hover: shadow-[0_0_15px_rgba(255,215,0,0.3)] transform hover: any;,
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`};
          >;
            Continue;
          </button>;
        </div>;
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>;
      </form>;
      <ExistingUserModal;
        isOpen={showExistingUserModal};
        onClose={() => setShowExistingUserModal(false)};
        userEmail={existingUserEmail || undefined};
        userMobile={existingUserMobile || undefined};
        type={modalType};
      />;
    </>;
  );
;
// Additional exports;
;
// Additional exports;
{ CustomerForm, navigate, autocompleteRef, inputRef, addressInputRef, unitInputRef, recaptchaContainerRef, emailCheckTimerRef, mobileCheckTimerRef, formatMobileNumber, digits, validateField, emailRegex, isValidFormat, digitsOnly, mobileRegex, postalRegex, isFormValid, requiredFields, handleInputChange, formattedValue, fieldValidation, suggestion, checkExistingEmail, checkExistingMobile, handleSuggestionClick, handleVerifyMobile, result, handleVerifyOTP, handleBlur, firebaseResult, handleGoogleMapsLoaded, initializeAutocomplete, handlePlaceSelect, place, blockNumber, streetName, postalCode, buildingName, types, formattedAddress, renderValidationIcon, field, commonClasses, handleSubmit, bookingData };
;
// Type exports;
CustomerForm;
;
;
export type { CustomerFormData, ValidationState, FormValidation, CustomerFormProps, Window };
export { CustomerForm, navigate, autocompleteRef, inputRef, addressInputRef, unitInputRef, recaptchaContainerRef, emailCheckTimerRef, mobileCheckTimerRef, formatMobileNumber, digits, validateField, emailRegex, isValidFormat, digitsOnly, mobileRegex, postalRegex, isFormValid, requiredFields, handleInputChange, formattedValue, fieldValidation, suggestion, checkExistingEmail, checkExistingMobile, handleSuggestionClick, handleVerifyMobile, result, handleVerifyOTP, handleBlur, firebaseResult, handleGoogleMapsLoaded, initializeAutocomplete, handlePlaceSelect, place, blockNumber, streetName, postalCode, buildingName, types, formattedAddress, renderValidationIcon, field, commonClasses, handleSubmit, bookingData };
;
export const CustomerForm: any;,
;

undefined.displayName = 'undefined';