import React, { memo } from 'react';
import { Users, Bell, Shield, BarChart3, Settings, Layout } from 'lucide-react';
import classNames from 'classnames';

interface AdminTabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

const tabs = [
  { id: 'users', icon: Users, label: 'User Management' },
  { id: 'homepage', icon: Layout, label: 'Homepage' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'amc', icon: Shield, label: 'AMC Packages' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

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
              {!collapsed && <span className="ml-3">{tab.label}</span>}
            </button>
          );
        })}
      </div>
      
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="p-4 border-t border-gray-700 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className={`h-5 w-5 mx-auto transform transition-transform ${
            collapsed ? 'rotate-180' : ''
          }`} />
        </button>
      )}
    </div>
  );
});

AdminTabs.displayName = 'AdminTabs';

export default AdminTabs;