import { useState, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Generic settings form hook
 * @param defaultSettings Default settings
 * @param saveSettings Save settings callback
 * @param fetchSettings Fetch settings callback
 */
export function useSettingsForm<T>(
  defaultSettings: T,
  saveSettings: (settings: T) => Promise<void>,
  fetchSettings: () => Promise<T>
) {
  const [settings, setSettings] = useState<T>(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [fetchSettings]);

  const updateSettings = (updates: Partial<T>) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    handleSave
  };
}
