import React, { memo } from 'react';

import IntegrationStatus from '@admin/IntegrationStatus';
import QuickSettings from '@admin/QuickSettings';

import type { AcuitySettings } from '@types/settings';

interface AdminHeaderProps {
  settings: AcuitySettings;
  integrationStatus: Record<string, boolean>;
  onIntervalChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AdminHeader = memo(({ 
  settings, 
  integrationStatus, 
  onIntervalChange 
}: AdminHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <QuickSettings 
        settings={settings}
        onIntervalChange={onIntervalChange}
      />
      <IntegrationStatus 
        integrationStatus={integrationStatus}
      />
    </div>
  );
});

AdminHeader.displayName = 'AdminHeader';

export { AdminHeader };
export default AdminHeader;