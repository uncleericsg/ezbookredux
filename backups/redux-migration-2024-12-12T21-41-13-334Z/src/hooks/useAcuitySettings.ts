import { useState, useEffect, useCallback } from 'react';
import { fetchAcuitySettings, fetchAppointmentTypes } from '../services/acuityIntegration';
import { defaultSettings } from '../types/settings';
import type { AcuitySettings, AcuityAppointmentType } from '../services/acuityIntegration';

const APP_SETTINGS_KEY = 'app_settings';

const getLoginScreenEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(APP_SETTINGS_KEY);
    if (!stored) return false;
    const settings = JSON.parse(stored);
    return settings.loginScreenEnabled ?? false;
  } catch {
    return false;
  }
};

export const useAcuitySettings = () => {
  const [settings, setSettings] = useState<AcuitySettings>(defaultSettings);
  const [appointmentTypes, setAppointmentTypes] = useState<AcuityAppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (import.meta.env.MODE === 'development') {
          const loginScreenEnabled = getLoginScreenEnabled();
          
          setSettings({
            ...defaultSettings,
            enabled: true,
            loginScreenEnabled,
            maintenanceMode: false,
            bookingEnabled: true,
          });
          
          setAppointmentTypes([
            {
              id: 1,
              name: 'Regular Maintenance',
              duration: 60,
              price: 60,
              type: 'maintenance',
            },
            {
              id: 2,
              name: 'Repair Service',
              duration: 120,
              price: 120,
              type: 'repair',
            },
            {
              id: 3,
              name: 'AMC Service Visit',
              duration: 60,
              price: 0,
              type: 'amc',
            },
          ]);
          setLoading(false);
          return;
        }

        const [settingsData, typesData] = await Promise.all([
          fetchAcuitySettings(),
          fetchAppointmentTypes(),
        ]);

        setSettings(settingsData);
        setAppointmentTypes(typesData);
      } catch (err) {
        console.error('Error loading Acuity settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AcuitySettings>) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      await updateAcuitySettings({ ...settings, ...newSettings });
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };
  const getAppointmentType = useCallback((categoryId: string) => {
    return appointmentTypes.find(type => type.category === categoryId);
  }, [appointmentTypes]);

  const getServiceDuration = (categoryId: string): number => {
    const appointmentType = getAppointmentType(categoryId);
    return appointmentType?.duration || 60; // Default to 60 minutes
  };

  return {
    settings,
    appointmentTypes,
    loading,
    error,
    getAppointmentType,
    getServiceDuration,
    updateSettings
  };
};