import React, { useState } from 'react';
import { Upload, Loader2, AlertTriangle, Settings } from 'lucide-react';
import { useRepairShopr } from '../../hooks/useRepairShopr';
import UserImportMapping from './UserImportMapping';
import { toast } from 'sonner';

const UserImport: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMapping, setShowMapping] = useState(false);
  const { verifyConnection, syncData } = useRepairShopr();

  const handleImport = async () => {
    try {
      setImporting(true);
      
      // First verify connection
      const isConnected = await verifyConnection();
      if (!isConnected) {
        toast.error('RepairShopr connection failed');
        return;
      }

      // Start import process
      const importToast = toast.loading('Starting user import...');
      
      await syncData('all', (progress) => {
        setProgress(progress.percentage);
        toast.loading(`Importing users: ${progress.percentage}%`, { id: importToast });
      });

      toast.success('User import completed successfully', { id: importToast });
    } catch (error) {
      toast.error('Failed to import users');
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">User Import</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowMapping(!showMapping)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Field Mapping</span>
          </button>
          <Upload className="h-6 w-6 text-blue-400" />
        </div>
      </div>

      {showMapping && <UserImportMapping />}

      <div className="space-y-6">
        {/* Import Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
            <div>
              <p className="text-sm text-blue-400">Before importing:</p>
              <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                <li>Verify RepairShopr API connection</li>
                <li>Ensure all required fields are mapped</li>
                <li>Back up existing user data if needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {importing && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 text-center">
              Importing users: {progress}%
            </p>
          </div>
        )}

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={importing}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          {importing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Importing Users...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Start Import</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserImport;