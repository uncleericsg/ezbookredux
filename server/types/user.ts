export interface User {
  id: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'technician';
  status: 'active' | 'inactive' | 'verified';
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
  verified_at?: string;
}

export interface UserProfile extends User {
  addresses: UserAddress[];
  preferences: {
    notifications: boolean;
    marketing: boolean;
    language: string;
  };
}

export interface UserAddress {
  id: string;
  user_id: string;
  address: string;
  postal_code: string;
  unit_number?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  paymentStatus: PaymentStatus;
  verificationId: string | null;
  phone: string | null;
} 