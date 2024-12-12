import React from 'react';
import { Key, Loader2, Save, MessageSquare, Sliders } from 'lucide-react';
import type { ChatGPTSettings as ChatGPTSettingsType } from '../../types';

interface ChatGPTSettingsProps {
  settings: ChatGPTSettingsType;
  loading?: boolean;
  updateSettings: (updates: Partial<ChatGPTSettingsType>) => void;
  onSave: () => Promise<void>;
  onTest?: () => Promise<void>;
}

const ChatGPTSettings: React.FC<ChatGPTSettingsProps> = ({
  settings,
  loading = false,
  updateSettings,
  onSave,
  onTest
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">ChatGPT Integration</h2>
        <MessageSquare className="h-6 w-6 text-blue-400" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="chatgptApiKey" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-400" />
              <span>API Key</span>
            </div>
          </label>
          <input
            type="password"
            id="chatgptApiKey"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ apiKey: e.target.value.trim() })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
            placeholder="Enter ChatGPT API Key"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-blue-400" />
              <span>Model</span>
            </div>
          </label>
          <select
            id="model"
            value={settings.model}
            onChange={(e) => updateSettings({ model: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
          >
            <option value="gpt-4">GPT-4 (Recommended)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-300 mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              id="maxTokens"
              value={settings.maxTokens}
              onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
              min="1"
              max="2000"
            />
          </div>

          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-300 mb-1">
              Temperature
            </label>
            <input
              type="number"
              id="temperature"
              value={settings.temperature}
              onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
              min="0"
              max="1"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enabled"
            checked={settings.enabled}
            onChange={(e) => updateSettings({ enabled: e.target.checked })}
            className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="enabled" className="ml-2 text-sm text-gray-300">
            Enable ChatGPT Integration
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
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

          {onTest && (
            <button
              type="button"
              onClick={onTest}
              disabled={loading || !settings.enabled || !settings.apiKey}
              className="btn btn-secondary flex items-center justify-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Test Connection</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatGPTSettings;