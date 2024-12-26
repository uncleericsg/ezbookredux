import classNames from 'classnames';
import { 
  BarChart3, 
  Bell, 
  Layout, 
  Settings, 
  Shield, 
  Users 
} from 'lucide-react';
import React, { memo } from 'react';

import type { AdminTabConfig } from '@admin/types';

import { ROUTES } from '@config/routes';

interface AdminTabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const tabs: AdminTabConfig[] = [
  { id: 'users', icon: Users, label: 'User Management', path: ROUTES.ADMIN.USERS },
  { id: 'homepage', icon: Layout, label: 'Homepage', path: ROUTES.ADMIN.HOMEPAGE },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: ROUTES.ADMIN.NOTIFICATIONS },
  { id: 'amc', icon: Shield, label: 'AMC Packages', path: ROUTES.ADMIN.AMC },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', path: ROUTES.ADMIN.ANALYTICS },
  { id: 'settings', icon: Settings, label: 'Settings', path: ROUTES.ADMIN.SETTINGS }
] as const;

const AdminTabs = memo(({ activeTab, onTabChange, collapsed, onToggleCollapse }: AdminTabsProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className={`font-bold transition-all duration-300 ${
          collapsed ? 'text-center text-xl' : 'text-2xl'
        }`}>
          {collapsed ? 'A' : 'Admin'}
        </h1>
      </div>

      <div className="flex-1 py-4 space-y-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(index)}
              className={classNames(
                'w-full flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-lg mx-2',
                {
                  'bg-blue-500/10 text-blue-500': activeTab === index,
                  'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50': activeTab !== index
                }
              )}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && (
                <span className="ml-3">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg"
        >
          <span className="sr-only">
            {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </span>
          {/* Chevron icon here */}
        </button>
      </div>
    </div>
  );
});

AdminTabs.displayName = 'AdminTabs';

export { AdminTabs };
export default AdminTabs;