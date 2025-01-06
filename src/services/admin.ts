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