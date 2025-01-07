import axios from 'axios';
import { toast } from 'sonner';
import type { AdminSettings } from '../types/settings';
import { defaultSettings } from '../types/settings';

export const fetchAdminSettings = async (): Promise<AdminSettings> => {
  if (import.meta.env.DEV) {
    return defaultSettings;
  }

  try {
    const response = await axios.get('/api/admin/settings', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin settings:', error);
    throw error;
  }
};

export const updateAdminSettings = async (settings: Partial<AdminSettings>): Promise<void> => {
  try {
    await axios.post('/api/admin/settings', settings, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to update admin settings:', error);
    toast.error('Failed to update settings');
    throw error;
  }
};

export const fetchBrandingSettings = async () => {
  if (import.meta.env.DEV) {
    return defaultSettings.branding;
  }

  try {
    const response = await axios.get('/api/admin/settings/branding', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch branding settings:', error);
    throw error;
  }
};

export const updateBrandingSettings = async (settings: typeof defaultSettings.branding): Promise<void> => {
  try {
    await axios.post('/api/admin/settings/branding', settings, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to update branding settings:', error);
    toast.error('Failed to update branding settings');
    throw error;
  }
};

export const restoreSettings = async (): Promise<void> => {
  try {
    await updateAdminSettings(defaultSettings);
    toast.success('Settings restored to defaults');
  } catch (error) {
    console.error('Failed to restore settings:', error);
    toast.error('Failed to restore settings');
    throw error;
  }
};

export const backupSettings = async (): Promise<void> => {
  try {
    const settings = await fetchAdminSettings();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to backup settings:', error);
    toast.error('Failed to backup settings');
    throw error;
  }
};

export const restoreFromBackup = async (file: File): Promise<void> => {
  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const settings = JSON.parse(e.target.result as string);
        await updateAdminSettings(settings);
        toast.success('Settings restored from backup');
      }
    };
    reader.readAsText(file);
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    toast.error('Failed to restore from backup');
    throw error;
  }
};

export const fetchAnalytics = async () => {
  if (import.meta.env.DEV) {
    // Return mock data in development
    return {
      totalBookings: 150,
      completedBookings: 120,
      pendingBookings: 30,
      revenue: 15000,
      topServices: [
        { name: 'Chemical Wash', count: 45 },
        { name: 'General Service', count: 35 },
        { name: 'Repair', count: 25 }
      ],
      recentBookings: []
    };
  }

  try {
    const response = await axios.get('/api/admin/analytics', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    toast.error('Failed to fetch analytics data');
    throw error;
  }
};

export const fetchBuildVersions = async () => {
  if (import.meta.env.DEV) {
    return [
      {
        id: '1',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        active: true,
        size: 1024 * 1024,
        changelog: 'Initial version'
      }
    ];
  }

  try {
    const response = await axios.get('/api/admin/builds');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch build versions:', error);
    throw error;
  }
};

export const uploadBuildVersion = async (files: FileList, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('build', files[0]);

  try {
    const response = await axios.post('/api/admin/builds/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload build:', error);
    throw error;
  }
};

export const rollbackBuild = async (versionId: string) => {
  try {
    await axios.post(`/api/admin/builds/${versionId}/rollback`);
  } catch (error) {
    console.error('Failed to rollback build:', error);
    throw error;
  }
};

export const deleteBuildVersions = async (versionIds: string[]) => {
  try {
    await axios.post('/api/admin/builds/delete', { versionIds });
  } catch (error) {
    console.error('Failed to delete build versions:', error);
    throw error;
  }
};