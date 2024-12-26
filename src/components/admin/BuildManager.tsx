import { format } from 'date-fns';
import { Upload, History, Loader2, Check, Trash2 } from 'lucide-react';
import React from 'react';

import { useBuildManager } from '@hooks/useBuildManager';

import type { BuildVersion } from '@types/index';

const BuildManager = () => {
  const {
    versions,
    loading,
    uploading,
    uploadProgress,
    selectedVersions,
    handleUpload,
    handleRollback,
    handleBulkDelete,
    toggleVersionSelection
  } = useBuildManager();

  const confirmRollback = async (version: BuildVersion) => {
    const shouldRollback = window.confirm(
      `Are you sure you want to rollback to version ${version.version}? This will restart the application.`
    );
    if (shouldRollback) {
      await handleRollback(version);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Upload className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Build Management</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {selectedVersions.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedVersions.length})</span>
            </button>
          )}
          
          <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload Build</span>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {uploading && (
        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                  checked={selectedVersions.length === versions.length}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    versions.forEach((version) => toggleVersionSelection(version.id, checked));
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {versions.map((version) => (
              <tr key={version.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    checked={selectedVersions.includes(version.id)}
                    onChange={(e) => toggleVersionSelection(version.id, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-white">{version.version}</span>
                  {version.current && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                      Current
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {format(new Date(version.uploadDate), 'MMM d, yyyy HH:mm:ss')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {(version.size / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => confirmRollback(version)}
                    disabled={version.current || loading}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-700 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : version.current ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <History className="h-4 w-4" />
                    )}
                    <span className="ml-2">{version.current ? 'Current' : 'Rollback'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

BuildManager.displayName = 'BuildManager';

export default BuildManager;