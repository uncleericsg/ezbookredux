import type { LucideIcon } from 'lucide-react';

/**
 * Configuration for an admin tab
 */
export interface AdminTabConfig {
  /** Unique identifier for the tab */
  id: string;
  /** Icon component to display */
  icon: LucideIcon;
  /** Display label for the tab */
  label: string;
  /** Route path for the tab */
  path: string;
}

/**
 * Analytics data structure
 */
export interface AnalyticsData {
  /** Total number of bookings */
  totalBookings: number;
  /** Total number of active users */
  activeUsers: number;
  /** Total revenue */
  revenue: number;
  /** Average booking value */
  averageBookingValue: number;
  /** Completion rate */
  completionRate: number;
  /** Cancellation rate */
  cancellationRate: number;
  /** Growth rate */
  growthRate: number;
  /** Time period for the analytics */
  period: 'day' | 'week' | 'month' | 'year';
  /** Timestamp of the data */
  timestamp: string;
}

/**
 * Admin dashboard state
 */
export interface AdminDashboardState {
  /** Currently active tab index */
  activeTab: number;
  /** Whether the sidebar is collapsed */
  sidebarCollapsed: boolean;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Analytics data */
  analytics: AnalyticsData | null;
}

/**
 * Admin notification
 */
export interface AdminNotification {
  /** Unique identifier */
  id: string;
  /** Notification type */
  type: 'info' | 'success' | 'warning' | 'error';
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Timestamp */
  timestamp: string;
  /** Whether the notification has been read */
  read: boolean;
  /** Action URL (optional) */
  actionUrl?: string;
  /** Action label (optional) */
  actionLabel?: string;
}

/**
 * Admin user role
 */
export type AdminRole = 'admin' | 'manager' | 'support';

/**
 * Admin user permissions
 */
export interface AdminPermissions {
  /** Can manage users */
  manageUsers: boolean;
  /** Can manage bookings */
  manageBookings: boolean;
  /** Can manage services */
  manageServices: boolean;
  /** Can manage settings */
  manageSettings: boolean;
  /** Can view analytics */
  viewAnalytics: boolean;
  /** Can manage notifications */
  manageNotifications: boolean;
  /** Can manage teams */
  manageTeams: boolean;
  /** Can manage AMC packages */
  manageAMC: boolean;
  /** Can manage branding */
  manageBranding: boolean;
  /** Can manage push notifications */
  managePush: boolean;
}

/**
 * Admin user
 */
export interface AdminUser {
  /** Unique identifier */
  id: string;
  /** Email address */
  email: string;
  /** Display name */
  name: string;
  /** User role */
  role: AdminRole;
  /** User permissions */
  permissions: AdminPermissions;
  /** Last login timestamp */
  lastLogin: string;
  /** Account status */
  status: 'active' | 'inactive' | 'suspended';
  /** Two-factor authentication enabled */
  twoFactorEnabled: boolean;
}

/**
 * Admin action
 */
export interface AdminAction {
  /** Unique identifier */
  id: string;
  /** Action type */
  type: string;
  /** Action target */
  target: string;
  /** Action timestamp */
  timestamp: string;
  /** User who performed the action */
  userId: string;
  /** Action details */
  details: Record<string, unknown>;
  /** Action status */
  status: 'pending' | 'completed' | 'failed';
  /** Error message if failed */
  error?: string;
}

/**
 * Admin audit log entry
 */
export interface AdminAuditLogEntry {
  /** Unique identifier */
  id: string;
  /** Event type */
  eventType: string;
  /** User who performed the action */
  userId: string;
  /** IP address */
  ipAddress: string;
  /** Timestamp */
  timestamp: string;
  /** Event details */
  details: Record<string, unknown>;
  /** Resource type */
  resourceType: string;
  /** Resource ID */
  resourceId: string;
  /** Changes made */
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}

/**
 * Admin settings section
 */
export interface AdminSettingsSection {
  /** Section ID */
  id: string;
  /** Section title */
  title: string;
  /** Section description */
  description: string;
  /** Section icon */
  icon: LucideIcon;
  /** Whether the section is enabled */
  enabled: boolean;
  /** Section permissions required */
  requiredPermissions: (keyof AdminPermissions)[];
}

/**
 * Admin navigation item
 */
export interface AdminNavItem {
  /** Item ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon */
  icon: LucideIcon;
  /** Path */
  path: string;
  /** Whether the item is active */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Required permissions */
  requiredPermissions?: (keyof AdminPermissions)[];
  /** Child items */
  children?: AdminNavItem[];
}
