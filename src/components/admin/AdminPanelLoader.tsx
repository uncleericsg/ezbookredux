import { motion } from 'framer-motion';
import React, { Suspense, lazy } from 'react';

// Lazy load components with error boundaries
const AdminPanels = {
  services: lazy(() => import("@admin/ServiceHub/ServiceHub").catch(() => ({ default: () => <div>Error loading Services</div> }))),
  teams: lazy(() => import("@admin/teams/TeamManagement").catch(() => ({ default: () => <div>Error loading Teams</div> }))),
  notifications: lazy(() => import("@admin/panels/NotificationManager").catch(() => ({ default: () => <div>Error loading Notifications</div> }))),
  homepage: lazy(() => import("@admin/HomepageManager").catch(() => ({ default: () => <div>Error loading Homepage</div> }))),
  amc: lazy(() => import("@admin/AMCPackageSettings").catch(() => ({ default: () => <div>Error loading AMC</div> }))),
  analytics: lazy(() => import("@admin/panels/Analytics").catch(() => ({ default: () => <div>Error loading Analytics</div> }))),
  branding: lazy(() => import("@admin/BrandingSettings").catch(() => ({ default: () => <div>Error loading Branding</div> }))),
  push: lazy(() => import("@admin/FCMTester").catch(() => ({ default: () => <div>Error loading Push</div> }))),
  settings: lazy(() => import("@admin/panels/Settings").catch(() => ({ default: () => <div>Error loading Settings</div> }))),
  users: lazy(() => import("@admin/panels/UserManagement").catch(() => ({ default: () => <div>Error loading Users</div> })))
} as const;

type AdminPanelType = keyof typeof AdminPanels;

interface Props {
  panel: AdminPanelType;
}

const AdminPanelLoader = ({ panel }: Props) => {
  const Panel = AdminPanels[panel];

  return (
    <Suspense
      fallback={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center h-full"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Panel />
      </motion.div>
    </Suspense>
  );
};

AdminPanelLoader.displayName = 'AdminPanelLoader';

export default AdminPanelLoader;
