import { supabaseClient } from '@/config/supabase/client';
import { handleDatabaseError } from '@/utils/apiErrors';
import type { AdminSettings, BrandingSettings } from '@/types/settings';
import { defaultBrandingSettings } from '@/types/settings';

export async function fetchAdminSettings(): Promise<AdminSettings> {
  try {
    const { data: settings, error } = await supabaseClient
      .from('admin_settings')
      .select('*')
      .single();

    if (error) throw error;

    // Ensure all required fields are present
    return {
      ...settings,
      role: settings.role || 'admin',
      permissions: settings.permissions || [],
      features: settings.features || {
        analytics: false,
        userManagement: false,
        settingsManagement: false,
        systemMonitoring: false
      },
      branding: settings.branding || defaultBrandingSettings
    };
  } catch (error) {
    throw handleDatabaseError({
      code: 'FETCH_ADMIN_SETTINGS_ERROR',
      message: 'Failed to fetch admin settings',
      originalError: error
    });
  }
}

export async function updateAdminSettings(
  updates: Partial<AdminSettings>
): Promise<AdminSettings> {
  try {
    const { data: settings, error } = await supabaseClient
      .from('admin_settings')
      .update(updates)
      .select()
      .single();

    if (error) throw error;

    return settings;
  } catch (error) {
    throw handleDatabaseError({
      code: 'UPDATE_ADMIN_SETTINGS_ERROR',
      message: 'Failed to update admin settings',
      originalError: error
    });
  }
}

export async function updateBrandingSettings(
  updates: Partial<BrandingSettings>
): Promise<AdminSettings> {
  try {
    const currentSettings = await fetchAdminSettings();
    const updatedBranding = {
      ...currentSettings.branding,
      ...updates
    };

    const { data: settings, error } = await supabaseClient
      .from('admin_settings')
      .update({ branding: updatedBranding })
      .select()
      .single();

    if (error) throw error;

    return settings;
  } catch (error) {
    throw handleDatabaseError({
      code: 'UPDATE_BRANDING_ERROR',
      message: 'Failed to update branding settings',
      originalError: error
    });
  }
}

export async function resetAdminSettings(): Promise<AdminSettings> {
  try {
    const defaultSettings: Partial<AdminSettings> = {
      features: {
        analytics: false,
        userManagement: false,
        settingsManagement: false,
        systemMonitoring: false
      },
      branding: defaultBrandingSettings,
      permissions: []
    };

    const { data: settings, error } = await supabaseClient
      .from('admin_settings')
      .update(defaultSettings)
      .select()
      .single();

    if (error) throw error;

    return settings;
  } catch (error) {
    throw handleDatabaseError({
      code: 'RESET_ADMIN_SETTINGS_ERROR',
      message: 'Failed to reset admin settings',
      originalError: error
    });
  }
}