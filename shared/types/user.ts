export type UserRole = 'user' | 'admin' | 'technician';
export type UserStatus = 'active' | 'inactive' | 'verified';

export interface UserProfile {
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  first_name?: string;
  last_name?: string;
  profile?: UserProfile;
  verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}