import classNames from 'classnames';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  BarChart3, 
  Bell, 
  Layout, 
  Palette, 
  Settings, 
  Shield, 
  Users, 
  Users2, 
  Wrench 
} from 'lucide-react';
import React, { memo } from 'react';

import type { AdminTabConfig } from '@admin/types';

import { ROUTES } from '@config/routes';

export interface AdminNavProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  collapsed?: boolean;
}

export type AdminTab = typeof tabs[number]['id'];

export const tabs: AdminTabConfig[] = Object.freeze([
  { id: 'services', icon: Wrench, label: 'Services', path: ROUTES.ADMIN.SERVICES },
  { id: 'users', icon: Users, label: 'Users', path: ROUTES.ADMIN.USERS },
  { id: 'teams', icon: Users2, label: 'Teams', path: ROUTES.ADMIN.TEAMS },
  { id: 'notifications', icon: AlertCircle, label: 'Notifications', path: ROUTES.ADMIN.NOTIFICATIONS },
  { id: 'amc', icon: Shield, label: 'AMC', path: ROUTES.ADMIN.AMC },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', path: ROUTES.ADMIN.ANALYTICS },
  { id: 'branding', icon: Palette, label: 'Branding', path: ROUTES.ADMIN.BRANDING },
  { id: 'push', icon: Bell, label: 'Push', path: ROUTES.ADMIN.PUSH },
  { id: 'settings', icon: Settings, label: 'Settings', path: ROUTES.ADMIN.SETTINGS },
  { id: 'homepage', icon: Layout, label: 'Homepage', path: ROUTES.ADMIN.HOMEPAGE }
] as const);

const AdminNav = memo<AdminNavProps>(({ activeTab, onTabChange, collapsed = false }) => {
  return (
    <nav className="space-y-0.5">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(index)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={classNames(
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-gray-800',
              activeTab === index
                ? 'bg-blue-500/10 text-blue-400 shadow-sm'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            )}
            aria-label={tab.label}
            role="tab"
            aria-selected={activeTab === index}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium truncate">{tab.label}</span>
            )}
          </motion.button>
        );
      })}
    </nav>
  );
});

AdminNav.displayName = 'AdminNav';

export { AdminNav };
export default AdminNav;