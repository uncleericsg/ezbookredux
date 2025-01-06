import { Key, Loader2, Save } from 'lucide-react';
import React from 'react';

import type { AppSettingsExtended } from '@types/appSettings';

interface StripeSettingsProps {
  settings: AppSettingsExtended;
  loading?: boolean;
  updateSettings: (updates: Partial<AppSettingsExtended>) => void;
  onSave: () => Promise<void>;
}

const StripeSettings: React.FC<StripeSettingsProps> = ({
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
      <h2 className="text-xl font-semibold mb-6">Stripe Integration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="stripePublishableKey" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-400" />
              <span>Publishable Key</span>
            </div>
          </label>
          <input
            type="password"
            id="stripePublishableKey"
            value={settings.stripePublishableKey || ''}
            onChange={(e) => updateSettings({ stripePublishableKey: e.target.value.trim() })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
            placeholder="Enter Stripe Publishable Key"
          />
        </div>

        <div>
          <label htmlFor="stripeSecretKey" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-400" />
              <span>Secret Key</span>
            </div>
          </label>
          <input
            type="password"
            id="stripeSecretKey"
            value={settings.stripeSecretKey || ''}
            onChange={(e) => updateSettings({ stripeSecretKey: e.target.value.trim() })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
            placeholder="Enter Stripe Secret Key"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="stripeEnabled"
            checked={settings.stripeEnabled || false}
            onChange={(e) => updateSettings({ stripeEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="stripeEnabled" className="ml-2 text-sm text-gray-300">
            Enable Stripe Integration
          </label>
        </div>

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

export default StripeSettings;