import { motion } from 'framer-motion';
import React, { memo } from 'react';

import { tabs } from '@admin/AdminNav';
import AdminPanelLoader from '@admin/AdminPanelLoader';

interface AdminPanelsProps {
  activeTab: number;
}

const getTabTitle = (tab: number) => {
  const validTab = Math.max(0, Math.min(tab, tabs.length - 1));
  return tabs[validTab].label;
};

const AdminPanels = memo(({ activeTab }: AdminPanelsProps) => {
  // Ensure activeTab is within valid bounds
  const validTab = Math.max(0, Math.min(activeTab, tabs.length - 1));
  const panelType = tabs[validTab].id;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{getTabTitle(activeTab)}</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <AdminPanelLoader panel={panelType} />
      </motion.div>
    </div>
  );
});

AdminPanels.displayName = 'AdminPanels';

export { AdminPanels };
export default AdminPanels;