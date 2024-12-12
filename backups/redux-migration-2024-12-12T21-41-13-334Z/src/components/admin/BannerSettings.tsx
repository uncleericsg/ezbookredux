import React, { useState } from 'react';
import { Save, Loader2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ColorPicker from '../ColorPicker';

interface BannerConfig {
  enabled: boolean;
  serviceDueThreshold: number;
  regularUsers: {
    enabled: boolean;
    threshold: number;
    message: string;
  };
  amcUsers: {
    enabled: boolean;
    threshold: number;
    message: string;
  };
}

const defaultConfig: BannerConfig = {
  enabled: true,
  serviceDueThreshold: 75,
  regularUsers: {
    enabled: true,
    threshold: 7,
    message: 'Service Due Soon! Your service is due in {days} days'
  },
  amcUsers: {
    enabled: true,
    threshold: 90,
    message: 'AMC Service Due Soon! Your service is due in {days} days'
  }
};

const BannerSettings: React.FC = () => {
  const [config, setConfig] = useState<BannerConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Banner settings saved successfully');
    } catch (error) {
      toast.error('Failed to save banner settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    toast.success('Settings reset to default');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Service Due Banner Settings</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
        </div>

        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
          >
            <p className="text-red-400 text-right">
              {config.regularUsers.message.replace('{days}', '7')}
            </p>
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Enable Service Due Banner</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Service Due Threshold (days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={config.serviceDueThreshold}
              onChange={(e) => setConfig({ ...config, serviceDueThreshold: parseInt(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            />
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4">Regular Users</h3>
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">Enable for Regular Users</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.regularUsers.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      regularUsers: { ...config.regularUsers, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <textarea
                value={config.regularUsers.message}
                onChange={(e) => setConfig({
                  ...config,
                  regularUsers: { ...config.regularUsers, message: e.target.value }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
                placeholder="Enter message template for regular users..."
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4">AMC Users</h3>
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">Enable for AMC Users</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.amcUsers.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      amcUsers: { ...config.amcUsers, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <textarea
                value={config.amcUsers.message}
                onChange={(e) => setConfig({
                  ...config,
                  amcUsers: { ...config.amcUsers, message: e.target.value }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
                placeholder="Enter message template for AMC users..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSettings;