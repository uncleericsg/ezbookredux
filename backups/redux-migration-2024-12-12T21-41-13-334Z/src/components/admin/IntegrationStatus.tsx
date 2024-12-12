import React, { memo } from 'react';

interface IntegrationStatusProps {
  integrationStatus: Record<string, boolean>;
}

const IntegrationStatus = memo(({ integrationStatus }: IntegrationStatusProps) => {
  const entries = React.useMemo(() => Object.entries(integrationStatus), [integrationStatus]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-medium mb-4">Integration Status</h3>
      <div className="space-y-4">
        {entries.map(([name, enabled]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-gray-300">{name}</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              enabled 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-gray-500/10 text-gray-400'
            }`}>
              {enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

IntegrationStatus.displayName = 'IntegrationStatus';

export default IntegrationStatus;