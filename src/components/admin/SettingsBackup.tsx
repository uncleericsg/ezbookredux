import { format } from 'date-fns';
import { Download, Upload, Loader2, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { backupSettings, restoreSettings } from '@services/admin';

const SettingsBackup: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const blob = await backupSettings();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iaircon-settings-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Settings backed up successfully');
    } catch (error) {
      toast.error('Failed to backup settings');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (file: File) => {
    setLoading(true);
    const confirmRestore = window.confirm(
      'Restoring settings will overwrite all current settings. Are you sure you want to continue?'
    );

    if (!confirmRestore) {
      setLoading(false);
      return;
    }

    try {
      await restoreSettings(file);
      toast.success('Settings restored successfully');
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      toast.error('Failed to restore settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Settings Backup & Recovery</h3>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
          <div>
            <p className="text-sm text-blue-400">Important</p>
            <p className="text-sm text-gray-300 mt-1">
              Backup files contain sensitive information including API keys. Store them securely.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <h4 className="font-medium mb-2">Backup Settings</h4>
          <p className="text-sm text-gray-400 mb-4">
            Download a ZIP file containing all your settings and configurations
          </p>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download Backup</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-gray-700/50 rounded-lg">
          <h4 className="font-medium mb-2">Restore Settings</h4>
          <p className="text-sm text-gray-400 mb-4">
            Upload a previously downloaded backup file to restore settings
          </p>
          <label className="w-full btn btn-secondary flex items-center justify-center space-x-2 cursor-pointer">
            <input
              type="file"
              accept=".zip"
              onChange={(e) => e.target.files?.[0] && handleRestore(e.target.files[0])}
              className="hidden"
              disabled={loading}
            />
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Upload Backup</span>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsBackup;