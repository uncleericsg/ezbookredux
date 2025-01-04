import { EmailSuggestion } from '@utils/emailUtils';

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  floorUnit: string;
  blockStreet: string;
  postalCode: string;
  condoName?: string;
  lobbyTower?: string;
  specialInstructions?: string;
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
  onSave: (formData: CustomerFormData) => void;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    addresses?: Array<{
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

export interface MobileValidationState {
  isValidating: boolean;
  showOTPInput: boolean;
  isMobileVerified: boolean;
  otpError?: string;
}

export interface ContactSectionProps {
  formData: CustomerFormData;
  validation: FormValidation;
  validationState: MobileValidationState;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onVerifyMobile: (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>) => void;
  onVerifyOTP: (code: string) => void;
  emailSuggestion: EmailSuggestion | null;
  onSuggestionClick: () => void;
}

export interface AddressSectionProps {
  formData: CustomerFormData;
  validation: FormValidation;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface PersonalInfoSectionProps {
  formData: CustomerFormData;
  validation: FormValidation;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface OptionalSectionProps {
  formData: CustomerFormData;
  validation: FormValidation;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ExistingUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userMobile?: string;
  type: 'email' | 'mobile';
}