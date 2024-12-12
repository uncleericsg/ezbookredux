import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseLogoOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

export const useLogo = (options: UseLogoOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const maxSize = options.maxSize || 2 * 1024 * 1024; // 2MB default
  const allowedTypes = options.allowedTypes || ['image/png', 'image/jpeg', 'image/svg+xml'];

  const uploadLogo = useCallback(async (
    file: File,
    type: 'website' | 'webapp' | 'favicon'
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
      }

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      }

      // Check dimensions for webapp logo
      if (type === 'webapp') {
        const dimensions = await getImageDimensions(file);
        if (dimensions.width < 512 || dimensions.height < 512) {
          throw new Error('Web app logo must be at least 512x512px');
        }
        setDimensions(dimensions);
      }
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Upload to server
      const response = await fetch('/api/admin/logo', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      // Cache the new logo URL
      const { url } = await response.json();
      localStorage.setItem(`logo_${type}`, url);

      options.onSuccess?.();
      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload logo';
      setError(message);
      toast.error(message);
      options.onError?.(err instanceof Error ? err : new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const getLogo = useCallback((
    type: 'website' | 'webapp' | 'favicon',
    size?: number
  ): string => {
    // Try to get from cache first
    const cached = localStorage.getItem(`logo_${type}`);
    if (cached) {
      // Append size parameter if specified
      if (size && type === 'webapp') {
        const url = new URL(cached);
        url.searchParams.set('size', size.toString());
        return url.toString();
      }
      return cached;
    }

    // Return default fallback logos
    switch (type) {
      case 'website':
        return '/logo.svg';
      case 'webapp':
        return size ? `/logo-${size}.png` : '/logo-512.png';
      case 'favicon':
        return '/favicon.ico';
      default:
        return '/logo.svg';
    }
  }, []);

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };
  return {
    uploadLogo,
    getLogo,
    loading,
    error,
    dimensions
  };
};

export default useLogo;