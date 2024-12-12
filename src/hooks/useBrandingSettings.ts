import { useState, useEffect, useCallback } from 'react';
import { updateBrandingSettings } from '../services/admin';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema
const brandingSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  logo: z.instanceof(File).nullable(),
  darkMode: z.boolean()
});

type BrandingSettings = z.infer<typeof brandingSettingsSchema>;

interface UseBrandingSettingsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useBrandingSettings = (options: UseBrandingSettingsOptions = {}) => {
  const [settings, setSettings] = useState<BrandingSettings>({
    primaryColor: '#3B82F6',
    secondaryColor: '#1D4ED8',
    logo: null,
    darkMode: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateSettings = useCallback((newSettings: Partial<BrandingSettings>): boolean => {
    try {
      brandingSettingsSchema.partial().parse(newSettings);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message = err.errors[0]?.message || 'Invalid settings';
        setError(message);
        toast.error(message);
      }
      return false;
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<BrandingSettings>) => {
    if (!validateSettings(newSettings)) {
      return;
    }

    setLoading(true);
    try {
      await updateBrandingSettings(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Update CSS variables
      if (newSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);
      }
      if (newSettings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', newSettings.secondaryColor);
      }
      
      options.onSuccess?.();
      toast.success('Branding settings updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update branding settings';
      setError(message);
      toast.error(message);
      options.onError?.(err instanceof Error ? err : new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options, validateSettings]);

  const handleLogoChange = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file must be less than 2MB');
      return;
    }

    // Clean up previous preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    // Create new preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    };
    reader.readAsDataURL(file);

    setSettings(prev => ({ ...prev, logo: file }));
  }, [preview]);

  return {
    settings,
    loading,
    error,
    preview,
    updateSettings,
    handleLogoChange,
  };
};

export default useBrandingSettings;