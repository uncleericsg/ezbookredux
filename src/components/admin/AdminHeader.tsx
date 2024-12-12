import React, { memo } from 'react';
import type { AcuitySettings } from '../../types/settings';
import QuickSettings from './QuickSettings';
import IntegrationStatus from './IntegrationStatus';

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

export default AdminHeader;