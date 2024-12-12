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
import { useFirebaseValidation } from '../../hooks/useFirebaseValidation';
import { OTPInput } from '../common/OTPInput';
import { findEmailTypo, EmailSuggestion } from '../../utils/emailUtils';
import { createBooking } from '../../services/bookingService';

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
        // Focus on the next field after successful verification
        setTimeout(() => {
          addressInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
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
    
    // Create booking data structure
    const bookingDetails: BookingDetails = {
      brands: [], // These will be filled in later steps
      issues: [],
      lastServiceDate: new Date().toISOString(),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        floorUnit: formData.unit,
        blockStreet: formData.address,
        postalCode: formData.postalCode,
        condoName: formData.buildingName,
        lobbyTower: formData.lobbyTower
      }
    };

    try {
      const bookingId = await createBooking(bookingDetails);
      console.log('Booking created with ID:', bookingId);
      // Only call onSave with the bookingId
      onSave({ ...formData, bookingId });
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle error appropriately
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-header">Customer Information</div>
      <div className="form-description">
        Please fill in your details for the booking
      </div>

      <div className="form-section">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
              />
              {renderValidationIcon('firstName')}
              {validation.firstName.touched && !validation.firstName.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.firstName.error}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
              />
              {renderValidationIcon('lastName')}
              {validation.lastName.touched && !validation.lastName.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.lastName.error}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
                  validationState.emailError ? 'border-red-500' : validationState.isEmailVerified ? 'border-green-500' : ''
                }`}
              />
              {renderValidationIcon('email')}
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
              {validationState.emailError ? (
                <div className="text-red-500 text-xs mt-1">{validationState.emailError}</div>
              ) : validationState.isEmailVerified ? (
                <div className="text-green-500 text-sm mt-1 flex items-center gap-2">
                  <FiCheck className="h-4 w-4" />
                  Email verified
                </div>
              ) : validation.email.touched && !validation.email.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.email.error}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
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
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
                disabled={validationState.showOTPInput || validationState.isMobileVerified}
              />
              {renderValidationIcon('mobile')}
            </div>
            {validation.mobile.touched && !validation.mobile.valid && !validationState.showOTPInput && (
              <div className="text-red-500 text-xs mt-1">{validation.mobile.error}</div>
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
                  onComplete={async (code) => {
                    try {
                      const result = await verifyOTP(code);
                      if (result.isValid) {
                        // Focus on the next field after successful verification
                        setTimeout(() => {
                          addressInputRef.current?.focus();
                        }, 100);
                      }
                    } catch (error) {
                      console.error('OTP verification error:', error);
                    }
                  }}
                  error={validationState.otpError}
                />
                {validationState.otpError && (
                  <div className="text-red-500 text-xs mt-1">{validationState.otpError}</div>
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

        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Address {!isGoogleMapsLoaded && <span className="text-xs text-gray-400">(Loading address search...)</span>}
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
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
              className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
              placeholder={!isGoogleMapsLoaded ? "Loading address search..." : ""}
              disabled={!isGoogleMapsLoaded}
            />
            {renderValidationIcon('address')}
            {validation.address.touched && !validation.address.valid && (
              <div className="text-red-500 text-xs mt-1">{validation.address.error}</div>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="postalCode" className="form-label">
              Postal Code
            </label>
            <div className="relative">
              <FiHome className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
                readOnly
              />
              {renderValidationIcon('postalCode')}
              {validation.postalCode.touched && !validation.postalCode.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.postalCode.error}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="unit" className="form-label">
              Unit Number (NA if none)
            </label>
            <div className="relative">
              <FiHash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                ref={unitInputRef}
                type="text"
                id="unit"
                name="unit"
                required
                value={formData.unit}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
              />
              {renderValidationIcon('unit')}
              {validation.unit.touched && !validation.unit.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.unit.error}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="buildingName" className="form-label">
              Condo Name (Optional)
            </label>
            <div className="relative">
              <FiHome className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                id="buildingName"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
              />
              {renderValidationIcon('buildingName')}
              {validation.buildingName.touched && !validation.buildingName.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.buildingName.error}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lobbyTower" className="form-label">
              Lobby/Tower (Optional)
            </label>
            <div className="relative">
              <FiBox className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                id="lobbyTower"
                name="lobbyTower"
                value={formData.lobbyTower}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent`}
              />
              {renderValidationIcon('lobbyTower')}
              {validation.lobbyTower.touched && !validation.lobbyTower.valid && (
                <div className="text-red-500 text-xs mt-1">{validation.lobbyTower.error}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="form-button-container">
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all duration-300 ${
            isFormValid()
              ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900 shadow-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transform hover:-translate-y-0.5'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
    </form>
  );
};

export default CustomerForm;
