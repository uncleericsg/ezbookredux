import type { BaseEntity } from './index';

export interface UserProfile extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'user' | 'technician';
  status: 'active' | 'inactive' | 'suspended';
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
  metadata?: Record<string, any>;
}

export interface UserAddress extends BaseEntity {
  user_id: string;
  floor_unit: string;
  block_street: string;
  postal_code: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
  is_default: boolean;
  is_verified: boolean;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    types: {
      booking_confirmation: boolean;
      booking_reminder: boolean;
      payment_confirmation: boolean;
      service_updates: boolean;
      promotions: boolean;
    };
  };
  privacy: {
    share_location: boolean;
    share_booking_history: boolean;
    allow_marketing: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    date_format: string;
    time_format: '12h' | '24h';
  };
}

export interface UserStats {
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_spent: number;
  average_rating: number;
  member_since: string;
  last_booking?: string;
  favorite_services: Array<{
    service_id: string;
    count: number;
  }>;
}
