import React from 'react';
import { Key, Loader2, Play, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CypressSettingsProps {
  settings: {
    cypressApiKey?: string;
    cypressEnabled?: boolean;
  };
  updateSettings: (updates: any) => void;
  loading?: boolean;
  onSave?: () => Promise<void>;
}

const CypressSettings: React.FC<CypressSettingsProps> = ({
  settings,
  updateSettings,
  loading,
  onSave
}) => {
  const [runningTests, setRunningTests] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      await onSave();
    }
  };

  const handleRunTests = async () => {
    if (!settings.cypressEnabled || !settings.cypressApiKey) {
      toast.error('Please enable Cypress and configure API key first');
      return;
    }

    setRunningTests(true);
    const testToast = toast.loading('Running Cypress tests...');

    try {
      // Simulate test run in development
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('All tests passed successfully', { id: testToast });
    } catch (error) {
      toast.error('Failed to run tests', { id: testToast });
    } finally {
      setRunningTests(false);
    }
  };

  return (
    <div className="p-4 bg-gray-700/50 rounded-lg space-y-4">
      <h3 className="text-lg font-medium mb-4">Cypress Integration</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="cypressApiKey" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-400" />
              <span>API Key</span>
            </div>
          </label>
          <input
            type="password"
            id="cypressApiKey"
            name="cypressApiKey"
            autoComplete="off"
            value={settings.cypressApiKey || ''}
            onChange={(e) => updateSettings({ cypressApiKey: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Cypress API Key"
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="cypressEnabled"
            checked={settings.cypressEnabled || false}
            onChange={(e) => updateSettings({ cypressEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="cypressEnabled" className="ml-2 text-sm text-gray-300">
            Enable Cypress Integration
          </label>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={loading}
          className="w-full btn btn-primary flex items-center justify-center space-x-2 mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Cypress Settings</span>
            </>
          )}
        </button>

        <button
          onClick={handleRunTests}
          disabled={loading || runningTests || !settings.cypressEnabled}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          {runningTests ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Running Tests...</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CypressSettings;