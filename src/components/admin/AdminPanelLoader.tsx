import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load components with error boundaries
const AdminPanels = {
  services: lazy(() => import("./ServiceHub/ServiceHub").catch(() => ({ default: () => <div>Error loading Services</div> }))),
  teams: lazy(() => import("./teams/TeamManagement").catch(() => ({ default: () => <div>Error loading Teams</div> }))),
  notifications: lazy(() => import("./panels/NotificationManager").catch(() => ({ default: () => <div>Error loading Notifications</div> }))),
  homepage: lazy(() => import("./HomepageManager").catch(() => ({ default: () => <div>Error loading Homepage</div> }))),
  amc: lazy(() => import("./AMCPackageSettings").catch(() => ({ default: () => <div>Error loading AMC</div> }))),
  analytics: lazy(() => import("./panels/Analytics").catch(() => ({ default: () => <div>Error loading Analytics</div> }))),
  branding: lazy(() => import("./BrandingSettings").catch(() => ({ default: () => <div>Error loading Branding</div> }))),
  push: lazy(() => import("./FCMTester").catch(() => ({ default: () => <div>Error loading Push</div> }))),
  settings: lazy(() => import("./panels/Settings").catch(() => ({ default: () => <div>Error loading Settings</div> }))),
  users: lazy(() => import("./panels/UserManagement").catch(() => ({ default: () => <div>Error loading Users</div> })))
} as const;

type AdminPanelType = keyof typeof AdminPanels;

interface AdminPanelLoaderProps {
  panel: AdminPanelType;
}

const LoadingFallback = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center items-center min-h-[200px]"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </motion.div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
  >
    <h3 className="text-red-500 font-semibold mb-2">Error Loading Component</h3>
    <p className="text-red-400">{error.message}</p>
  </motion.div>
);

const AdminPanelLoader: React.FC<AdminPanelLoaderProps> = ({ panel }) => {
  console.log('AdminPanelLoader rendering with panel:', panel);

  const PanelComponent = AdminPanels[panel];
  if (!PanelComponent) {
    console.error(`Panel component not found for panel type: ${panel}`);
    return (
      <ErrorFallback error={new Error(`Panel "${panel}" not found. Please check the configuration.`)} />
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <motion.div
        key={panel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <PanelComponent />
      </motion.div>
    </Suspense>
  );
};

export default AdminPanelLoader;
