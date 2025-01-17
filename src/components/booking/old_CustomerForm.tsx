import React, { useState, useEffect, useRef } from 'react';
import './CustomerForm.css';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiHash, FiBox, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useFirebaseValidation } from '../../hooks/useFirebaseValidation';
import { OTPInput } from '../common/OTPInput';
import { findEmailTypo, EmailSuggestion } from '../../utils/emailUtils';
import { createBooking } from '../../services/bookingService';
import { supabaseClient } from '@/server/config/supabase/client';
import { profileService } from '../../services/supabase/profileService';
import { bookingService } from '../../services/supabase/bookingService';
import { toast } from 'react-hot-toast';
import ExistingUserModal from './ExistingUserModal';

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  postalCode: string;
  unit: string;
  buildingName?: string;
  lobbyTower?: string;
}

export interface ValidationState {
  touched: boolean;
  valid: boolean;
  error?: string;
}

export interface FormValidation {
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

export interface CustomerFormProps {
  onSave: (formData: CustomerFormData & { bookingId: string; customerInfo: any }) => void;
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
    google: any;
    initMap: () => void;
    isGoogleMapsLoaded: boolean;
  }
}

export const CustomerForm: React.FC<CustomerFormProps> = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    postalCode: '',
    unit: '',
    buildingName: '',
    lobbyTower: ''
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
    lobbyTower: { touched: false, valid: true } // Optional field
  });

  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();
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
  const [showExistingUserModal, setShowExistingUserModal] = useState(false);
  const [modalType, setModalType] = useState<'email' | 'mobile'>('email');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [existingUserEmail, setExistingUserEmail] = useState<string | null>(null);
  const [existingUserMobile, setExistingUserMobile] = useState<string | null>(null);

  const emailCheckTimerRef = useRef<NodeJS.Timeout>();
  const mobileCheckTimerRef = useRef<NodeJS.Timeout>();

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
          error: isValidFormat ? undefined : 'Invalid email format'
        };
      }
      case 'mobile': {
        const digitsOnly = value.replace(/\D/g, '');
        const mobileRegex = /^[89]\d{7}$/;
        return {
          touched: true,
          valid: mobileRegex.test(digitsOnly),
          error: mobileRegex.test(digitsOnly) ? undefined : 'Invalid mobile number'
        };
      }
      case 'address':
        return {
          touched: true,
          valid: value.length >= 5,
          error: value.length < 5 ? 'Please enter a valid address' : undefined
        };
      case 'postalCode': {
        const postalRegex = /^\d{6}$/;
        return {
          touched: true,
          valid: postalRegex.test(value),
          error: postalRegex.test(value) ? undefined : 'Invalid postal code'
        };
      }
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
          valid: true // Optional fields
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
      const suggestion = findEmailTypo(value);
      setEmailSuggestion(suggestion);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setValidation(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));

    // Debounce email check
    if (name === 'email') {
      if (emailCheckTimerRef.current) {
        clearTimeout(emailCheckTimerRef.current);
      }
      emailCheckTimerRef.current = setTimeout(() => {
        checkExistingEmail(value);
      }, 500);
    }
  };

  const checkExistingEmail = async (email: string) => {
    if (!email || !validation.email.valid) return;

    setIsCheckingUser(true);
    try {
      const { data: existingUser } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        setExistingUserEmail(email);
        setModalType('email');
        setShowExistingUserModal(true);
      }
    } catch (error) {
      console.error('Error checking existing email:', error);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const checkExistingMobile = async (mobile: string) => {
    const digitsOnly = mobile.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length !== 8) return;

    setIsCheckingUser(true);
    try {
      const { data: existingUser } = await supabaseClient
        .from('profiles')
        .select('mobile')
        .eq('mobile', digitsOnly)
        .single();

      if (existingUser) {
        setExistingUserMobile(digitsOnly);
        setModalType('mobile');
        setShowExistingUserModal(true);
      }
    } catch (error) {
      console.error('Error checking existing mobile:', error);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      // Create user account
      const { data: userData, error } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: formData.mobile.replace(/\D/g, '')
          }
        }
      });

      if (error) throw error;

      // Get service category ID
      const { data: serviceCategory, error: categoryError } = await supabaseClient
        .from('service_categories')
        .select('id')
        .eq('name', props.isAMC ? 'AMC' : 'Regular Service')
        .single();

      if (categoryError) throw categoryError;

      // Get available time slot
      const { data: timeSlot, error: timeSlotError } = await supabaseClient
        .from('time_slots')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (timeSlotError) throw timeSlotError;

      // Create booking
      const { data: newBooking, error: bookingError } = await supabaseClient
        .from('bookings')
        .insert([{
          user_id: userData.user?.id,
          service_category_id: serviceCategory.id,
          time_slot_id: timeSlot.id,
          status: 'pending',
          price_snapshot: {}, // This should be populated with actual pricing data
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Call onSave with the form data and booking ID
      const bookingData = {
        ...formData,
        bookingId: newBooking.id,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile
        }
      };

      props.onSave(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
                <FiLoader className="animate-spin" />
                <span>Creating your booking...</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input block w-full pl-10 ${
                  validation.firstName.touched && !validation.firstName.valid
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {validation.firstName.touched && !validation.firstName.valid && (
              <p className="mt-1 text-sm text-red-600">{validation.firstName.error}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input block w-full pl-10 ${
                  validation.lastName.touched && !validation.lastName.valid
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {validation.lastName.touched && !validation.lastName.valid && (
              <p className="mt-1 text-sm text-red-600">{validation.lastName.error}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input block w-full pl-10 ${
                  validation.email.touched && !validation.email.valid
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {emailSuggestion && (
              <div className="mt-1">
                <p className="text-sm text-gray-600">
                  Did you mean{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, email: emailSuggestion.suggestion }));
                      setEmailSuggestion(null);
                    }}
                  >
                    {emailSuggestion.suggestion}
                  </button>
                  ?
                </p>
              </div>
            )}
            {validationState.emailError ? (
              <p className="mt-1 text-sm text-red-600">{validationState.emailError}</p>
            ) : (
              validation.email.touched &&
              !validation.email.valid && (
                <p className="mt-1 text-sm text-red-600">{validation.email.error}</p>
              )
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (
                    charCode > 31 &&
                    (charCode < 48 || charCode > 57) &&
                    charCode !== 32
                  ) {
                    e.preventDefault();
                  }
                }}
                className={`form-input block w-full pl-10 ${
                  validation.mobile.touched && !validation.mobile.valid
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {validation.mobile.touched && !validation.mobile.valid && !validationState.showOTPInput && (
              <p className="mt-1 text-sm text-red-600">{validation.mobile.error}</p>
            )}
            {!validationState.showOTPInput && !validationState.isMobileVerified && validation.mobile.valid && (
              <button
                type="button"
                className={`mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  validationState.isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
                onClick={() => sendOTP(formData.mobile)}
                disabled={validationState.isLoading}
              >
                {validationState.isLoading ? (
                  <>
                    <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Sending OTP...
                  </>
                ) : (
                  'Verify Mobile'
                )}
              </button>
            )}
            {validationState.showOTPInput && (
              <div className="mt-4">
                <OTPInput
                  length={6}
                  onComplete={async (code) => {
                    try {
                      const isValid = await verifyOTP(code);
                      if (isValid) {
                        toast.success('Mobile number verified successfully!');
                        if (addressInputRef.current) {
                          setTimeout(() => {
                            addressInputRef.current?.focus();
                          }, 100);
                        }
                      }
                    } catch (error) {
                      console.error('OTP verification error:', error);
                      toast.error('Failed to verify OTP. Please try again.');
                    }
                  }}
                />
                {validationState.otpError && (
                  <p className="mt-1 text-sm text-red-600">{validationState.otpError}</p>
                )}
              </div>
            )}
            {validationState.isMobileVerified && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <FiCheck className="mr-1" /> Mobile number verified
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="relative">
              <input
                ref={(el) => {
                  addressInputRef.current = el;
                  if (isGoogleMapsLoaded && el && !autocompleteRef.current) {
                    initializeAutocomplete(el);
                  }
                }}
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`form-input block w-full pl-10 ${
                  validation.address.touched && !validation.address.valid
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {validation.address.touched && !validation.address.valid && (
              <p className="mt-1 text-sm text-red-600">{validation.address.error}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className={`form-input block w-full pl-10 ${
                    validation.postalCode.touched && !validation.postalCode.valid
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                />
                <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {validation.postalCode.touched && !validation.postalCode.valid && (
                <p className="mt-1 text-sm text-red-600">{validation.postalCode.error}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className={`form-input block w-full pl-10 ${
                    validation.unit.touched && !validation.unit.valid
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  required
                />
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {validation.unit.touched && !validation.unit.valid && (
                <p className="mt-1 text-sm text-red-600">{validation.unit.error}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
              Building Name (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="buildingName"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleInputChange}
                className="form-input block w-full pl-10 border-gray-300 focus:border-blue-500"
              />
              <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {validation.buildingName.touched && !validation.buildingName.valid && (
              <p className="mt-1 text-sm text-red-600">{validation.buildingName.error}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lobbyTower" className="block text-sm font-medium text-gray-700">
              Lobby/Tower (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="lobbyTower"
                name="lobbyTower"
                value={formData.lobbyTower}
                onChange={handleInputChange}
                className="form-input block w-full pl-10 border-gray-300 focus:border-blue-500"
              />
              <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {validation.lobbyTower.touched && !validation.lobbyTower.valid && (
              <p className="mt-1 text-sm text-red-600">{validation.lobbyTower.error}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting || isCheckingUser}
          className={`w-full py-4 px-6 rounded-lg font-medium text-base transition-all duration-300 ${
            !isFormValid() || isSubmitting || isCheckingUser
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Creating Booking...' : 'Continue'}
        </button>
      </form>
      <ExistingUserModal
        isOpen={showExistingUserModal}
        onClose={() => setShowExistingUserModal(false)}
        userEmail={existingUserEmail || undefined}
        userMobile={existingUserMobile || undefined}
        type={modalType}
      />
    </>
  );
};

export default CustomerForm;