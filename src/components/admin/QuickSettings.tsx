import React, { memo } from 'react';

import type { AcuitySettings } from '@types/settings';

interface QuickSettingsProps {
  settings: AcuitySettings;
  onIntervalChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OPTIONS = [
  { value: 10, label: '10 weeks' },
  { value: 11, label: '11 weeks (75 days)' },
  { value: 12, label: '12 weeks' }
] as const;

const QuickSettings = memo(({ settings, onIntervalChange }: QuickSettingsProps) => {
  const intervalValue = settings.defaultIntervalWeeks || 11;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-medium mb-4">Quick Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Default Service Interval
          </label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
            value={intervalValue}
            onChange={onIntervalChange}
          >
            {OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
});

QuickSettings.displayName = 'QuickSettings';

export default QuickSettings;