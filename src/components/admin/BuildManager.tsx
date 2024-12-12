import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, History, Loader2, Check, AlertTriangle, Trash2 } from 'lucide-react';
import { useBuildManager } from '../../hooks/useBuildManager';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { BuildVersion } from '../../types';

const BuildManager: React.FC = () => {
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
    const confirmRollback = window.confirm(
      `Are you sure you want to rollback to version ${version.version}? This will restart the application.`
    );
    if (confirmRollback) {
      await handleRollback(version);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
      <h3 className="text-lg font-semibold mb-4">Build Version Management</h3>
      
      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="font-medium text-blue-400 mb-2">Upload Instructions</h4>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Upload a ZIP file containing your build files</li>
          <li>Maximum file size: 100MB</li>
          <li>The ZIP should contain all necessary static assets</li>
          <li>Previous versions are automatically backed up</li>
        </ul>
      </div>

      {/* Upload Section */}
      <div 
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const zipFile = files.find(f => f.name.endsWith('.zip'));
          
          if (!zipFile) {
            toast.error('Please upload a ZIP file');
            return;
          }
          
          handleUpload(new FileList([zipFile]));
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6"
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">
          Drag and drop a ZIP file here or
        </p>
        <label className="btn btn-secondary cursor-pointer">
          <input
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length === 1) {
                handleUpload(e.target.files);
              }
            }}
          />
          Browse Files
        </label>
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-blue-400">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Version History */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-300 flex items-center space-x-2">
          <History className="h-4 w-4" />
          <span>Version History ({versions.length})</span>
          {selectedVersions.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="ml-auto btn btn-secondary flex items-center space-x-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedVersions.length})</span>
            </button>
          )}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-2">
            {Array.isArray(versions) && versions.map((version) => (
              <div
                key={version.id}
                className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {!version.active && (
                    <input
                      type="checkbox"
                      checked={selectedVersions.includes(version.id)}
                      onChange={() => toggleVersionSelection(version.id)}
                      className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                    />
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Version {version.version}</span>
                    {version.active && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Deployed {format(new Date(version.timestamp), 'PPp')}
                  </p>
                  {version.size && (
                    <p className="text-sm text-gray-400 mt-1">
                      Size: {(version.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  )}
                </div>
                
                {!version.active && (
                  <button
                    onClick={() => handleRollback(version)}
                    className="btn btn-secondary flex items-center space-x-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Rollback</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {versions.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            No build versions found
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildManager;

const handleUpload = async (files: FileList) => {
  const uploadToast = toast.loading('Preparing upload...');
  try {
    setUploading(true);
    setUploadProgress(0);
    
    const zipFile = Array.from(files).find(f => f.name.endsWith('.zip'));
    
    if (!zipFile) {
      toast.error('Please upload a ZIP file', { id: uploadToast });
      return;
    }
    
    // Validate file size
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (zipFile.size > maxSize) {
      toast.error('File size exceeds 100MB limit', { id: uploadToast });
      return;
    }

    const formData = new FormData();
    formData.append('build', zipFile);
    formData.append('version', new Date().toISOString());

    if (import.meta.env.DEV) {
      // Simulate upload in development
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        toast.loading(`Uploading: ${i}%`, { id: uploadToast });
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const mockVersion = {
        id: Date.now().toString(),
        version: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        files: ['index.html', 'main.js', 'style.css'],
        active: true,
        size: zipFile.size
      };
      
      setVersions(prev => [mockVersion, ...prev.map(v => ({ ...v, active: false }))]);
      toast.success('Build uploaded successfully', { id: uploadToast });
    } else {
      const response = await axios.post('/api/admin/build/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
            toast.loading(`Uploading: ${progress}%`, { id: uploadToast });
          }
        }
      });

      // Validate server response
      if (!response.data?.id || !response.data?.version) {
        throw new Error('Invalid server response');
      }
      
      // Add new version to the list
      setVersions(prev => [response.data, ...prev.map(v => ({ ...v, active: false }))]);
      toast.success('Build uploaded successfully', { id: uploadToast });
    }
  } catch (error) {
    console.error('Failed to upload build:', error);
    if (axios.isAxiosError(error) && error.response?.status === 413) {
      toast.error('Build file is too large. Maximum size is 100MB.', { id: uploadToast });
    } else {
      toast.error('Failed to upload build', { id: uploadToast });
    }
    throw error;
  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
};