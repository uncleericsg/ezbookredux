import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';

import { tabs } from '@admin/AdminNav';

interface AdminGridMenuProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

const AdminGridMenu = ({ activeTab, onTabChange }: AdminGridMenuProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classNames(
              'flex flex-col items-center justify-center p-3 rounded-lg transition-colors min-h-[80px]',
              'hover:bg-gray-700/50',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800',
              'touch-manipulation',
              activeTab === index
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            )}
            aria-label={tab.label}
            role="tab"
            aria-selected={activeTab === index}
            tabIndex={0}
          >
            <Icon className="h-5 w-5 mb-1.5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

AdminGridMenu.displayName = 'AdminGridMenu';

export { AdminGridMenu };
export default AdminGridMenu;