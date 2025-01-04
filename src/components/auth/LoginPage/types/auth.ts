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

export interface ReturnData {
  returnUrl?: string;
  bookingData?: any;
}

export interface OtpState {
  mobileNumber: string;
  otp: string;
  loading: boolean;
  showOtpButton: boolean;
  otpSent: boolean;
}

export interface VideoBackgroundProps {
  videoLoaded: boolean;
  videoError: boolean;
  onLoadedData: () => void;
  onError: (error: any) => void;
}

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  animate?: boolean;
}