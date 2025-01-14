import { useState, useEffect } from 'react';
import { 
  fetchBuildVersions, 
  uploadBuildVersion, 
  rollbackBuild,
  deleteBuildVersions
} from '@services/admin';
import { toast } from 'sonner';
import type { BuildVersion } from '@types';

export const useBuildManager = () => {
  const [versions, setVersions] = useState<BuildVersion[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const loadVersions = async () => {
    try {
      const data = await fetchBuildVersions();
      const sortedVersions = (Array.isArray(data) ? data : []).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setVersions(sortedVersions);
    } catch (error) {
      console.error('Failed to load build versions:', error);
      toast.error('Failed to load build versions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersions();
  }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);
    const uploadToast = toast.loading('Uploading build files...');

    // Validate file size
    const file = files[0];
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error('File size exceeds 100MB limit', { id: uploadToast });
      setUploading(false);
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      toast.error('Please upload a ZIP file', { id: uploadToast });
      setUploading(false);
      return;
    }

    try {
      const version = await uploadBuildVersion(files, (progress) => {
        setUploadProgress(progress);
        if (progress % 20 === 0) {
          toast.loading(`Uploading: ${progress}%`, { id: uploadToast });
        }
      });

      // Add new version to the list and mark others as inactive
      setVersions(prev => [
        { ...version, active: true },
        ...prev.map(v => ({ ...v, active: false }))
      ]);

      toast.success('Build uploaded successfully', { id: uploadToast });
    } catch (error) {
      console.error('Failed to upload build:', error);
      toast.error('Failed to upload build', { id: uploadToast });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRollback = async (version: BuildVersion) => {
    const confirmRollback = window.confirm(
      `Are you sure you want to rollback to version ${version.version}? This will restart the application.`
    );

    if (!confirmRollback) {
      return;
    }

    const rollbackToast = toast.loading('Rolling back to previous version...');

    try {
      await rollbackBuild(version.id);
      // Update versions list to reflect the rollback
      setVersions(prev => prev.map(v => ({
        ...v,
        active: v.id === version.id
      })));

      await loadVersions();
      toast.success('Rollback successful', { id: rollbackToast });
      
      // Notify about application restart
      toast.info('Application will restart in 5 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error('Failed to rollback:', error);
      toast.error('Failed to rollback', { id: rollbackToast });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVersions.length === 0) return;

    const activeVersion = versions.find(v => v.active);
    const hasActiveSelected = selectedVersions.includes(activeVersion?.id || '');

    if (hasActiveSelected) {
      toast.error('Cannot delete active version');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedVersions.length} version(s)? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    const deleteToast = toast.loading(`Deleting ${selectedVersions.length} versions...`);

    try {
      await deleteBuildVersions(selectedVersions);
      await loadVersions();
      setSelectedVersions([]);
      toast.success('Versions deleted successfully', { id: deleteToast });
    } catch (error) {
      console.error('Failed to delete versions:', error);
      toast.error('Failed to delete versions', { id: deleteToast });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSelectedVersions([]);
      setUploadProgress(0);
    };
  }, []);

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => 
      prev.includes(versionId)
        ? prev.filter(id => id !== versionId)
        : [...prev, versionId]
    );
  };

  return {
    versions,
    loading,
    uploading,
    uploadProgress,
    selectedVersions,
    handleUpload,
    handleRollback,
    handleBulkDelete,
    toggleVersionSelection,
  };
};