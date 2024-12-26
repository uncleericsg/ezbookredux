/*
 * @ai-protection - DO NOT MODIFY THIS FILE
 * This is a stable version of the customer form component that handles:
 * 1. User information collection and validation
 * 2. Mobile number verification with Firebase OTP
 * 3. Address autocomplete with Google Places API
 * 4. Form state management and validation
 * 5. Auto-focus behavior for improved UX
 * 
 * Critical Features:
 * - Mobile OTP verification flow
 * - Address validation and autocomplete
 * - Email validation with typo detection
 * - Form validation and error handling
 * - Auto-focus behavior after OTP and address selection
 * 
 * Integration Points:
 * - Firebase Authentication for OTP
 * - Google Places API for address
 * - Email validation service
 * - Booking service
 * 
 * @ai-visual-protection: The visual design and styling must be preserved exactly as is
 * @ai-flow-protection: The form flow and validation sequence must not be altered
 * @ai-state-protection: The state management pattern is optimized and stable
 * 
 * Any modifications to this component could affect:
 * 1. User authentication flow
 * 2. Booking process
 * 3. Address validation
 * 4. Form validation
 * 
 * If changes are needed:
 * 1. Create a detailed proposal
 * 2. Test thoroughly in development
 * 3. Verify all integrations still work
 * 4. Ensure no regression in form validation
 */

import React, { useState, useEffect, useRef } from 'react';
import './CustomerForm.css';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiHash, FiBox, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useFirebaseValidation } from '@hooks/useFirebaseValidation';
import { OTPInput } from '@components/common/OTPInput';
import { findEmailTypo, EmailSuggestion } from '@utils/emailUtils';
import { createBooking } from '@services/bookingService';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  postalCode: string;
  unit: string;
  buildingName: string;
  lobbyTower: string;
}

interface ValidationState {
  touched: boolean;
  valid: boolean;
  error?: string;
}

interface FormValidation {
  firstName: ValidationState;
  lastName: ValidationState;
  email: ValidationState;
  mobile: ValidationState;
  address: ValidationState;
  postalCode: ValidationState;
  unit: ValidationState;
  buildingName: ValidationState;
  lobbyTower: ValidationState;
}

interface CustomerFormProps {
  onSave: (formData: CustomerFormData & { bookingId: string }) => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    addresses: Array<{
      id: string;
      floorUnit: string;
      blockStreet: string;
      postalCode: string;
      condoName?: string;
      lobbyTower?: string;
      isDefault: boolean;
    }>;
  };
  isAMC?: boolean;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    isGoogleMapsLoaded: boolean;
  }
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, user, isAMC = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.addresses?.[0]?.blockStreet || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    unit: user?.addresses?.[0]?.floorUnit || '',
    buildingName: user?.addresses?.[0]?.condoName || '',
    lobbyTower: user?.addresses?.[0]?.lobbyTower || ''
  });

  const [validation, setValidation] = useState<FormValidation>({
    firstName: { touched: false, valid: false },
    lastName: { touched: false, valid: false },
    email: { touched: false, valid: false },
    mobile: { touched: false, valid: false },
    address: { touched: false, valid: false },
    postalCode: { touched: false, valid: false },
    unit: { touched: false, valid: false },
    buildingName: { touched: false, valid: true }, // Optional field
    lobbyTower: { touched: false, valid: true },   // Optional field
  });

  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const unitInputRef = useRef<HTMLInputElement>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<EmailSuggestion | null>(null);
  const { 
    validationState, 
    validateEmail, 
    sendOTP, 
    verifyOTP, 
    resetValidation,
    resetEmailValidation 
  } = useFirebaseValidation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatMobileNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 4) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    return digits;
  };

  const validateField = (name: string, value: string): ValidationState => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return {
          touched: true,
          valid: value.length >= 2,
          error: value.length < 2 ? 'Must be at least 2 characters' : undefined
        };
      case 'email': {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidFormat = emailRegex.test(value);
        return {
          touched: true,
          valid: isValidFormat,
          error: !isValidFormat ? 'Please enter a valid email address' : undefined
        };
      }
      case 'mobile':
        const digitsOnly = value.replace(/\D/g, '');
        const mobileRegex = /^[89]\d{7}$/;
        return {
          touched: true,
          valid: mobileRegex.test(digitsOnly),
          error: !mobileRegex.test(digitsOnly) ? 'Must be 8 digits starting with 8 or 9' : undefined
        };
      case 'address':
        return {
          touched: true,
          valid: value.length > 0,
          error: value.length === 0 ? 'Address is required' : undefined
        };
      case 'postalCode':
        const postalRegex = /^[0-9]{6}$/;
        return {
          touched: true,
          valid: postalRegex.test(value),
          error: !postalRegex.test(value) ? 'Invalid postal code' : undefined
        };
      case 'unit':
        return {
          touched: true,
          valid: value.length > 0,
          error: value.length === 0 ? 'Unit number is required' : undefined
        };
      case 'buildingName':
      case 'lobbyTower':
        return {
          touched: true,
          valid: true // Optional fields are always valid
        };
      default:
        return { touched: true, valid: true };
    }
  };

  const isFormValid = (): boolean => {
    const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'address', 'postalCode', 'unit'];
    return requiredFields.every(field => validation[field as keyof FormValidation].valid);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for mobile number
    if (name === 'mobile') {
      const formattedValue = formatMobileNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      setValidation(prev => ({
        ...prev,
        [name]: validateField(name, formattedValue)
      }));
      
      const mobileValidation = validateField(name, formattedValue);
      setShowVerifyButton(mobileValidation.valid);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldValidation = validateField(name, value);
    setValidation(prev => ({
      ...prev,
      [name]: fieldValidation
    }));

    // Handle email validation and typo detection
    if (name === 'email') {
      setEmailSuggestion(null);
      
      if (!fieldValidation.valid) {
        resetEmailValidation();
      } else if (value) {
        const suggestion = findEmailTypo(value);
        if (suggestion) {
          setEmailSuggestion(suggestion);
          return;
        }

        const firebaseResult = await validateEmail(value);
        if (!firebaseResult.isValid) {
          setValidation(prev => ({
            ...prev,
            [name]: { touched: true, valid: false, error: firebaseResult.error }
          }));
        }
      }
    }
  };

  const handleSuggestionClick = () => {
    if (emailSuggestion) {
      setFormData(prev => ({ ...prev, email: emailSuggestion.full }));
      setEmailSuggestion(null);
      // Trigger validation for the corrected email
      validateEmail(emailSuggestion.full);
    }
  };

  const handleVerifyMobile = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!recaptchaContainerRef.current) return;
    
    const result = await sendOTP(formData.mobile, 'recaptcha-container');
    if (!result.isValid) {
      setValidation(prev => ({
        ...prev,
        mobile: { touched: true, valid: false, error: result.error }
      }));
    }
  };

  const handleVerifyOTP = async (code: string) => {
    try {
      const result = await verifyOTP(code);
      if (result.isValid) {
        // Update form validation state
        setValidation(prev => ({
          ...prev,
          mobile: { ...prev.mobile, valid: true }
        }));

        // Focus on the next field after successful verification
        setTimeout(() => {
          addressInputRef.current?.focus();
        }, 100);
      } else {
        // Show error if OTP verification failed
        setValidation(prev => ({
          ...prev,
          mobile: { touched: true, valid: false, error: result.error }
        }));
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setValidation(prev => ({
        ...prev,
        mobile: { touched: true, valid: false, error: 'Failed to verify OTP' }
      }));
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const fieldValidation = validateField(name, value);
    setValidation(prev => ({
      ...prev,
      [name]: fieldValidation
    }));

    // Handle email validation on blur
    if (name === 'email') {
      if (!fieldValidation.valid) {
        // Reset Firebase email validation if format is invalid
        resetEmailValidation();
      } else if (value) {
        // Only proceed with Firebase validation if format is valid
        const firebaseResult = await validateEmail(value);
        if (!firebaseResult.isValid) {
          setValidation(prev => ({
            ...prev,
            [name]: { touched: true, valid: false, error: firebaseResult.error }
          }));
        }
      }
    }
  };

  useEffect(() => {
    if (window.google?.maps) {
      setIsGoogleMapsLoaded(true);
      initializeAutocomplete();
    } else {
      const handleGoogleMapsLoaded = () => {
        setIsGoogleMapsLoaded(true);
        initializeAutocomplete();
      };

      window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);

      return () => {
        window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      };
    }
  }, []);

  useEffect(() => {
    return () => {
      resetValidation();
    };
  }, []);

  useEffect(() => {
    if (validationState.isMobileVerified) {
      // Focus address field after mobile verification
      setTimeout(() => {
        addressInputRef.current?.focus();
      }, 100);
    }
  }, [validationState.isMobileVerified]);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'sg' },
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      types: ['address']
    });

    // Prevent the default blur behavior when selecting from autocomplete
    inputRef.current.addEventListener('blur', (e) => {
      if (document.querySelector('.pac-container')?.contains(e.relatedTarget as Node)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.address_components) return;

      let blockNumber = '';
      let streetName = '';
      let postalCode = '';

      place.address_components.forEach(component => {
        const types = component.types;
        if (types.includes('street_number')) blockNumber = component.long_name;
        if (types.includes('route')) streetName = component.long_name;
        if (types.includes('postal_code')) postalCode = component.long_name;
      });

      const formattedAddress = blockNumber && streetName 
        ? `${blockNumber} ${streetName}`.trim()
        : place.formatted_address || '';

      setFormData(prev => ({
        ...prev,
        address: formattedAddress,
        postalCode: postalCode
      }));

      setValidation(prev => ({
        ...prev,
        address: validateField('address', formattedAddress),
        postalCode: validateField('postalCode', postalCode)
      }));

      // Auto-focus unit field after address selection
      setTimeout(() => {
        unitInputRef.current?.focus();
      }, 100);
    });
  };

  const renderValidationIcon = (fieldName: keyof FormValidation) => {
    const field = validation[fieldName];
    if (!field.touched) return null;

    if (fieldName === 'mobile' && validationState.showOTPInput) {
      return null; // Don't show validation icon while OTP verification is in progress
    }

    const commonClasses = "absolute right-3 top-2.5 h-5 w-5 stroke-[3]";
    return field.valid ? (
      <FiCheck className={`validation-icon ${commonClasses} text-green-400`} />
    ) : (
      <FiX className={`validation-icon ${commonClasses} text-red-400`} />
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields with correct field names
    const requiredFields = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      floorUnit: formData.unit.trim(), // Map unit to floorUnit
      blockStreet: formData.address.trim(), // Map address to blockStreet
      postalCode: formData.postalCode.trim()
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return;
    }

    // Prepare form data with correct field names and only non-empty optional fields
    const submitData = {
      ...requiredFields,
      ...(formData.buildingName?.trim() && { condoName: formData.buildingName.trim() }), // Map buildingName to condoName
      ...(formData.lobbyTower?.trim() && { lobbyTower: formData.lobbyTower.trim() })
    };

    console.log('Submitting customer form data:', submitData);
    onSave(submitData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
              First Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                  validation.firstName.touched
                    ? validation.firstName.valid
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-600'
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your first name"
              />
            </div>
            {validation.firstName.touched && !validation.firstName.valid && (
              <p className="mt-2 text-sm text-red-500">{validation.firstName.error}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
              Last Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                  validation.lastName.touched
                    ? validation.lastName.valid
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-600'
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your last name"
              />
            </div>
            {validation.lastName.touched && !validation.lastName.valid && (
              <p className="mt-2 text-sm text-red-500">{validation.lastName.error}</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
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
                onChange={handleInputChange}
                onBlur={handleBlur}
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
            {emailSuggestion && (
              <div className="text-yellow-400 text-sm mt-1">
                Did you mean{' '}
                <button
                  type="button"
                  onClick={handleSuggestionClick}
                  className="underline hover:text-yellow-300 focus:outline-none"
                >
                  {emailSuggestion.full}
                </button>
                ?
              </div>
            )}
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
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && validation.mobile.valid && !validationState.showOTPInput && !validationState.isMobileVerified) {
                    e.preventDefault();
                    handleVerifyMobile(e as any);
                  }
                }}
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
                onClick={handleVerifyMobile}
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
            {validationState.showOTPInput && (
              <div className="mt-2">
                <OTPInput
                  length={6}
                  onComplete={handleVerifyOTP}
                  error={validationState.otpError}
                />
                {validationState.otpError && (
                  <p className="mt-2 text-sm text-red-500">{validationState.otpError}</p>
                )}
              </div>
            )}
            {validationState.isMobileVerified && (
              <div className="text-green-500 text-sm mt-1 flex items-center gap-2">
                <FiCheck className="h-4 w-4" />
                Mobile verified
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="relative">
            <label htmlFor="address" className="block text-sm font-medium text-gray-200 mb-2">
              Street Address {!isGoogleMapsLoaded && <span className="text-xs text-gray-400">(Loading address search...)</span>}
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={(el) => {
                  inputRef.current = el;
                  addressInputRef.current = el;
                }}
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                  validation.address.touched
                    ? validation.address.valid
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-600'
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={!isGoogleMapsLoaded ? "Loading address search..." : ""}
                disabled={!isGoogleMapsLoaded}
              />
            </div>
            {validation.address.touched && !validation.address.valid && (
              <p className="mt-2 text-sm text-red-500">{validation.address.error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-200 mb-2">
                Postal Code
              </label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                    validation.postalCode.touched
                      ? validation.postalCode.valid
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  readOnly
                />
              </div>
              {validation.postalCode.touched && !validation.postalCode.valid && (
                <p className="mt-2 text-sm text-red-500">{validation.postalCode.error}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-200 mb-2">
                Unit Number (NA if none)
              </label>
              <div className="relative">
                <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={unitInputRef}
                  type="text"
                  id="unit"
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                    validation.unit.touched
                      ? validation.unit.valid
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {validation.unit.touched && !validation.unit.valid && (
                <p className="mt-2 text-sm text-red-500">{validation.unit.error}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label htmlFor="buildingName" className="block text-sm font-medium text-gray-200 mb-2">
                Building Name (Optional)
              </label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                    validation.buildingName.touched
                      ? validation.buildingName.valid
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {validation.buildingName.touched && !validation.buildingName.valid && (
                <p className="mt-2 text-sm text-red-500">{validation.buildingName.error}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="lobbyTower" className="block text-sm font-medium text-gray-200 mb-2">
                Lobby/Tower (Optional)
              </label>
              <div className="relative">
                <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="lobbyTower"
                  name="lobbyTower"
                  value={formData.lobbyTower}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                    validation.lobbyTower.touched
                      ? validation.lobbyTower.valid
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-gray-600'
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {validation.lobbyTower.touched && !validation.lobbyTower.valid && (
                <p className="mt-2 text-sm text-red-500">{validation.lobbyTower.error}</p>
              )}
            </div>
          </div>
        </div>

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
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      </form>
    </div>
  );
};

export default CustomerForm;
