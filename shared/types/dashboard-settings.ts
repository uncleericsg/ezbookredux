/**
 * Dashboard settings types
 */

/**
 * Dashboard view mode
 */
export type DashboardView = 'grid' | 'list' | 'calendar';

/**
 * Dashboard theme
 */
export type DashboardTheme = 'light' | 'dark' | 'system';

/**
 * Dashboard density
 */
export type DashboardDensity = 'comfortable' | 'compact';

/**
 * Dashboard notification settings
 */
export interface DashboardNotifications {
  /**
   * Enable daily email summary
   */
  emailDaily: boolean;

  /**
   * Enable weekly email report
   */
  emailWeekly: boolean;

  /**
   * Enable important push notifications
   */
  pushImportant: boolean;

  /**
   * Enable task reminder push notifications
   */
  pushReminders: boolean;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  /**
   * Default view mode
   */
  defaultView: DashboardView;

  /**
   * Number of items to display per page
   */
  itemsPerPage: number;

  /**
   * Theme preference
   */
  theme: DashboardTheme;

  /**
   * UI density preference
   */
  density: DashboardDensity;

  /**
   * Notification settings
   */
  notifications: DashboardNotifications;
}

/**
 * Default dashboard configuration
 */
export const defaultDashboardConfig: DashboardConfig = {
  defaultView: 'grid',
  itemsPerPage: 20,
  theme: 'system',
  density: 'comfortable',
  notifications: {
    emailDaily: false,
    emailWeekly: true,
    pushImportant: true,
    pushReminders: true
  }
};

/**
 * Dashboard settings component props
 */
export interface DashboardSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current settings
   */
  settings?: DashboardConfig;

  /**
   * Save settings callback
   */
  onSave: (settings: DashboardConfig) => Promise<void>;

  /**
   * Loading state
   */
  loading?: boolean;
}
