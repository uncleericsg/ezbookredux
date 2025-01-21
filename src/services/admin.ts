import { supabaseClient } from '@/config/supabase/client';
import { APIError } from '@/utils/apiErrors';
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
    throw new APIError(
      'FETCH_ADMIN_SETTINGS_ERROR',
      'Failed to fetch admin settings',
      500,
      { error }
    );
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
    throw new APIError(
      'UPDATE_ADMIN_SETTINGS_ERROR',
      'Failed to update admin settings',
      500,
      { error }
    );
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
    throw new APIError(
      'UPDATE_BRANDING_ERROR',
      'Failed to update branding settings',
      500,
      { error }
    );
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
    throw new APIError(
      'RESET_ADMIN_SETTINGS_ERROR',
      'Failed to reset admin settings',
      500,
      { error }
    );
  }
}