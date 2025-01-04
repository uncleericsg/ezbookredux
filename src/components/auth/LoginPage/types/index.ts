import { type ReactNode } from 'react';
import { type ANIMATION_VARIANTS } from '../constants';

/**
 * Core data types
 */
export interface UserData {
  id: string;
  phone: string;
  role: 'regular' | 'admin';
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  bookings: any[];
  notifications: any[];
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export interface PublicRouteState {
  isFullyAuthenticated: boolean;
  currentUser: UserData | null;
  intendedPath: string;
}

/**
 * Component Props
 */
export interface VideoBackgroundProps {
  onLoadedData: () => void;
  onError: (error: any) => void;
}

export interface FirstTimeCustomerPanelProps {
  className?: string;
}

export interface ExistingCustomerPanelProps {
  className?: string;
}

export interface WelcomeHeaderProps {
  className?: string;
}

export interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  animate?: boolean;
  icon?: ReactNode;
}

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Hook Types
 */
export interface UseAuthReturn {
  login: (userData: UserData, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UseOtpVerificationReturn {
  mobileNumber: string;
  otp: string;
  loading: boolean;
  showOtpButton: boolean;
  otpSent: boolean;
  handleMobileNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendOtp: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface UseReturnUrlReturn {
  returnUrl: string;
  bookingData: any;
  setReturnData: (data: { returnUrl: string; bookingData?: any }) => void;
}

export interface UseVideoBackgroundReturn {
  videoLoaded: boolean;
  videoError: boolean;
  handleLoadedData: () => void;
  handleError: (error: any) => void;
}

/**
 * Animation Types
 */
export type AnimationVariant = keyof typeof ANIMATION_VARIANTS;

export interface AnimationProps {
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Style Types
 */
export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Form Types
 */
export interface FormState {
  mobileNumber: string;
  otp: string;
}

export interface FormErrors {
  mobileNumber?: string;
  otp?: string;
}

/**
 * Navigation Types
 */
export interface NavigationState {
  returnUrl?: string;
  bookingData?: any;
  isFirstTimeCustomer?: boolean;
}