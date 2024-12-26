import { Key, Loader2, Save } from 'lucide-react';
import React from 'react';

import RepairShoprMapping from '@admin/RepairShoprMapping';

import type { AcuitySettings } from '@types/settings';

interface RepairShoprSettingsProps {
  settings: AcuitySettings;
  loading?: boolean;
  updateSettings: (updates: any) => void;
  onSave: () => Promise<void>;
}

const RepairShoprSettings: React.FC<RepairShoprSettingsProps> = ({
  settings,
  loading = false,
  updateSettings,
  onSave
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6">RepairShopr Integration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="repairShoprApiKey" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-400" />
              <span>API Key</span>
            </div>
          </label>
          <input
            type="password"
            id="repairShoprApiKey"
            value={settings.repairShoprApiKey || ''}
            onChange={(e) => updateSettings({ repairShoprApiKey: e.target.value.trim() })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
            placeholder="Enter RepairShopr API Key"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="repairShoprEnabled"
            checked={settings.repairShoprEnabled || false}
            onChange={(e) => updateSettings({ repairShoprEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="repairShoprEnabled" className="ml-2 text-sm text-gray-300">
            Enable RepairShopr Integration
          </label>
        </div>

        {settings.repairShoprEnabled && (
          <RepairShoprMapping
            onSave={async (mappings) => {
              await updateSettings({ repairShoprFieldMappings: mappings });
            }}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RepairShoprSettings;