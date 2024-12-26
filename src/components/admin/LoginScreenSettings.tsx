import { motion } from 'framer-motion';
import { Save, Loader2, AlertTriangle } from 'lucide-react';
import React from 'react';

import type { AppSettings } from '@types/appSettings';

interface LoginScreenSettingsProps {
  settings: AppSettings;
  loading?: boolean;
  updateSettings: (updates: Partial<AppSettings>) => void;
  onSave: () => Promise<void>;
}

const LoginScreenSettings: React.FC<LoginScreenSettingsProps> = ({
  settings,
  loading = false,
  updateSettings,
  onSave
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  const handleToggle = () => {
    updateSettings({ loginScreenEnabled: !settings.loginScreenEnabled });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6">Login Screen Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Login Screen Visibility</div>
            <p className="text-sm text-gray-400">
              Control whether users need to log in to access the application
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.loginScreenEnabled}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.loginScreenEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
              <div className="text-sm">
                <p className="text-blue-400 font-medium">Important:</p>
                <p className="text-gray-300 mt-1">
                  When enabled, users must log in to access any part of the application. 
                  Make sure all users have valid credentials before enabling this feature.
                </p>
              </div>
            </div>
          </motion.div>
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

export default LoginScreenSettings;