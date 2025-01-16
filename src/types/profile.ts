export type UserRole = 'admin' | 'service_provider' | 'customer';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone_number?: string;
  avatar_url?: string | null;
}

export interface ProfileResponse {
  id: string;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  role: UserRole;
} 