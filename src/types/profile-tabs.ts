
/**
 * Profile tab type
 */
export type ProfileTab = 'overview' | 'profile' | 'bookings' | 'addresses';

/**
 * Profile tabs props interface
 */

/**
 * Profile tabs props interface
 */
export interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  className?: string;
}

/**
 * Profile tab item interface
 */
export interface ProfileTabItem {
  id: ProfileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}