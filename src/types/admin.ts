import type { AdminSettings } from './settings';

export interface TopService {
  name: string;
  count: number;
}

export interface AnalyticsData {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  revenue: number;
  topServices: TopService[];
  recentBookings: any[]; // TODO: Replace with proper BookingData type when available
}

export interface BuildVersion {
  id: string;
  version: string;
  timestamp: string;
  active: boolean;
  size: number;
  changelog: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  joinDate: string;
  amcStatus: 'active' | 'inactive' | 'pending';
  role: 'regular' | 'admin' | 'technician';
  lastServiceDate: string | null;
  nextServiceDate: string | null;
}

export interface AdminResponse<T> {
  data: T;
  message?: string;
}

export type AdminSettingsUpdate = Partial<AdminSettings>;
export type UserUpdate = Partial<Omit<UserData, 'id'>>;

export interface AdminData {
  settings: AdminSettings;
  analytics: AnalyticsData;
  users: UserData[];
  buildVersions: BuildVersion[];
  lastUpdated: string;
}
