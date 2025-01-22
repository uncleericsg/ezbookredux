/**
 * Membership tier type
 */
export type MembershipTier = 'AMC' | 'REGULAR';

/**
 * Profile stats props type
 */
export interface ProfileStatsProps {
  totalBookings: number;
  completedServices: number;
  memberSince: string;
  membershipTier: MembershipTier;
  nextServiceDate?: string;
  contractExpiryDate?: string;
}

/**
 * Customer type panel props type
 */
export interface CustomerTypePanelProps {
  membershipTier: MembershipTier;
  memberSince: string;
  nextServiceDate?: string;
  contractExpiryDate?: string;
}

/**
 * Stats card props type
 */
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom: string;
  iconBgColor: string;
  iconColor: string;
}

/**
 * Date formatting utilities
 */
export const formatProfileDate = (date: string | Date): string => {
  if (!date) return 'Not scheduled';
  try {
    if (date instanceof Date) {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return String(date);
  }
};