// Form Data Types
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

// Props Types
export interface CustomerFormProps {
  onSave: (formData: CustomerFormData) => void;
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

// Section Props Types
export interface PersonalInfoSectionProps {
  formData: Pick<CustomerFormData, 'firstName' | 'lastName'>;
  validation: Pick<FormValidation, 'firstName' | 'lastName'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ContactSectionProps {
  formData: Pick<CustomerFormData, 'email' | 'mobile'>;
  validation: Pick<FormValidation, 'email' | 'mobile'>;
  validationState: {
    showOTPInput: boolean;
    isMobileVerified: boolean;
    isValidating: boolean;
    otpError?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onVerifyMobile: (e: React.MouseEvent) => void;
  onVerifyOTP: (code: string) => void;
}

export interface AddressSectionProps {
  formData: Pick<CustomerFormData, 'blockStreet' | 'postalCode' | 'floorUnit'>;
  validation: Pick<FormValidation, 'address' | 'postalCode' | 'unit'>;
  isGoogleMapsLoaded: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface OptionalSectionProps {
  formData: Pick<CustomerFormData, 'condoName' | 'lobbyTower'>;
  validation: Pick<FormValidation, 'buildingName' | 'lobbyTower'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// Declare global types for Google Maps
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    isGoogleMapsLoaded: boolean;
  }
}