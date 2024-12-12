import axios from 'axios';
import { toast } from 'sonner';
import type { AppSettings } from '../types/appSettings';
import { defaultAppSettings } from '../types/appSettings';

const APP_SETTINGS_KEY = 'app_settings';

const getStoredSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(APP_SETTINGS_KEY);
    if (!stored) return defaultAppSettings;
    const settings = JSON.parse(stored);
    return { ...defaultAppSettings, ...settings };
  } catch (error) {
    console.error('Error parsing stored settings:', error);
    return defaultAppSettings;
  }
};

export const fetchAppSettings = async (): Promise<AppSettings> => {
  if (import.meta.env.DEV) {
    return getStoredSettings();
  }

  try {
    const response = await axios.get('/api/admin/settings/app', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    });
    return { ...defaultAppSettings, ...response.data };
  } catch (error) {
    console.error('Failed to fetch app settings:', error);
    throw error;
  }
};

export const updateAppSettings = async (settings: AppSettings): Promise<AppSettings> => {
  if (import.meta.env.DEV) {
    // Persist settings in localStorage for development
    const updatedSettings = { ...defaultAppSettings, ...settings };
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updatedSettings));
    toast.success('App settings updated successfully');
    return updatedSettings;
  }

  try {
    const response = await axios.post('/api/admin/settings/app', settings, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`
      }
    });
    toast.success('App settings updated successfully');
    return { ...defaultAppSettings, ...response.data };
  } catch (error) {
    console.error('Failed to update app settings:', error);
    toast.error('Failed to update app settings');
    throw error;
  }
};
