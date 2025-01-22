import type { User } from './user';
import type { BookingData } from './booking-flow';

/**
 * Profile tab type
 */
export type ProfileTab = 'overview' | 'profile' | 'bookings' | 'addresses';

/**
 * Profile stats type
 */
export interface ProfileStats {
  totalBookings: number;
  completedServices: number;
  memberSince: string;
  membershipTier: MembershipTier;
  nextServiceDate?: string;
  contractExpiryDate?: string;
}

/**
 * Membership tier type
 */
export type MembershipTier = 'AMC' | 'REGULAR';

/**
 * Profile update data type
 */
export interface ProfileUpdateData extends Partial<User> {
  address?: string;
  unitNumber?: string;
  condoName?: string;
  lobbyTower?: string;
}

/**
 * Profile service history type
 */
export interface ServiceHistoryItem {
  id: string;
  date: string;
  time?: string;
  serviceType: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  address: string;
  technician?: string;
  rating?: number;
  feedback?: string;
}

/**
 * Profile quick action type
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
  color: string;
}

/**
 * Profile address type
 */
export interface ProfileAddress {
  id: string;
  label: string;
  address: string;
  unitNumber?: string;
  condoName?: string;
  lobbyTower?: string;
  postalCode: string;
  isDefault: boolean;
}

/**
 * Profile state type
 */
export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  activeTab: ProfileTab;
  stats: ProfileStats;
  serviceHistory: ServiceHistoryItem[];
  addresses: ProfileAddress[];
  bookings: BookingData[];
}