import { useState, useCallback, useEffect } from 'react';
import { isEqual } from '../utils/object';
import { toast } from 'sonner';

export const useSettingsForm = <T extends Record<string, any>>(
  defaultSettings: T,
  saveFunction: (settings: T) => Promise<void>,
  fetchFunction: () => Promise<T>
) => {
  const [settings, setSettings] = useState<T>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const fetchedSettings = await fetchFunction();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [fetchFunction]);

  const updateSettings = useCallback((updates: Partial<T>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      setHasChanges(!isEqual(newSettings, settings));
      return newSettings;
    });
  }, [settings]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveFunction(settings);
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    setHasChanges(false);
  }, [defaultSettings]);

  return {
    settings,
    loading,
    hasChanges,
    updateSettings,
    handleSave,
    resetSettings
  };
};