import axios from 'axios';
import { toast } from 'sonner';
import * as JSZip from 'jszip';
import type { User } from '../types';

export const backupSettings = async (): Promise<Blob> => {
  try {
    // Get user from auth context instead of admin token
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    if (!user || user.role !== 'admin') {
      throw new Error('Admin authentication required');
    }

    const settings = {
      acuity: await fetchAcuitySettings(),
      branding: await fetchBrandingSettings(),
      notifications: await fetchNotificationSettings(),
      cypress: await fetchCypressSettings(),
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: import.meta.env.MODE,
        checksum: '', // Will be populated after data serialization
      }
    };

    // Generate checksum of settings data
    const settingsJson = JSON.stringify(settings);
    const checksum = await generateChecksum(settingsJson);
    settings.metadata.checksum = checksum;

    const zip = new JSZip();
    zip.file('settings.json', JSON.stringify(settings, null, 2));
    
    // Add manifest file with backup details
    zip.file('manifest.json', JSON.stringify({
      timestamp: settings.metadata.timestamp,
      version: settings.metadata.version,
      environment: settings.metadata.environment,
      checksum: settings.metadata.checksum,
      files: ['settings.json']
    }, null, 2));

    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  } catch (error) {
    console.error('Failed to backup settings:', error);
    throw error;
  }
};

export const restoreSettings = async (file: File): Promise<void> => {
  try {
    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Backup file exceeds maximum size limit');
    }

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      throw new Error('Invalid backup file format - must be a ZIP file');
    }

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    const settingsFile = contents.file('settings.json');
    const manifestFile = contents.file('manifest.json');
    
    if (!settingsFile || !manifestFile) {
      throw new Error('Invalid backup file format');
    }

    const settings = JSON.parse(await settingsFile.async('string'));
    const manifest = JSON.parse(await manifestFile.async('string'));

    // Validate backup version
    if (!manifest.version.startsWith('1.0')) {
      throw new Error('Unsupported backup version');
    }

    // Verify checksum
    const settingsChecksum = await generateChecksum(JSON.stringify(settings));
    if (settingsChecksum !== manifest.checksum) {
      throw new Error('Backup file integrity check failed');
    }

    // Validate settings structure
    if (!validateSettingsStructure(settings)) {
      throw new Error('Invalid settings structure in backup file');
    }

    // Restore settings
    const restoredSettings = {
      acuity: await updateAcuitySettings(settings.acuity),
      branding: await updateBrandingSettings(settings.branding),
      notifications: await updateNotificationSettings(settings.notifications),
      cypress: await updateCypressSettings(settings.cypress)
    };

    // Log restoration event
    await logSettingsRestore({
      timestamp: new Date().toISOString(),
      version: manifest.version,
      success: true,
      restoredSettings
    });

    toast.success('Settings restored successfully');

  } catch (error) {
    console.error('Failed to restore settings:', error);
    
    // Log restoration failure
    await logSettingsRestore({
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    throw error;
  }
};

interface AcuitySettings {
  apiKey: string;
  userId: string;
  enabled: boolean;
  defaultIntervalWeeks: number;
  repairShoprApiKey?: string;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  chatGPTSettings?: ChatGPTSettings;
  cypressApiKey?: string;
  cypressEnabled?: boolean;
}

export const fetchAcuitySettings = async (): Promise<AcuitySettings> => {
  if (import.meta.env.DEV) {
    return {
      apiKey: '',
      userId: '',
      enabled: true,
      defaultIntervalWeeks: 11, // 75 days ≈ 11 weeks
      repairShoprApiKey: '',
      stripePublishableKey: '',
      stripeSecretKey: '',
      chatGPTSettings: {
        apiKey: '',
        model: 'gpt-4',
        enabled: false,
        maxTokens: 500,
        temperature: 0.7
      },
      cypressApiKey: '',
      cypressEnabled: false
    };
  }

  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const response = await axios.get('/api/admin/settings/acuity', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Acuity settings:', error);
    throw error;
  }
};

interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logo: File | null;
  darkMode: boolean;
}

interface AnalyticsData {
  bookings: Array<{
    month: string;
    count: number;
  }>;
  satisfaction: Array<{
    rating: number;
    count: number;
  }>;
  metrics: {
    activeAMCs: number;
    completedServices: number;
    averageRating: number;
  };
}

export const updateAcuitySettings = async (settings: AcuitySettings): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    await axios.post('/api/admin/settings/acuity', settings, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    toast.success('Integration settings updated successfully');
  } catch (error) {
    console.error('Failed to update Acuity settings:', error);
    toast.error('Failed to update integration settings');
    throw error;
  }
};

export const updateBrandingSettings = async (settings: BrandingSettings): Promise<void> => {
  if (import.meta.env.DEV) {
    // Mock successful update in development
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    await axios.post('/api/admin/settings/branding', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user.token}`
      }
    });
  } catch (error) {
    console.error('Failed to update branding settings:', error);
    throw error;
  }
};

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  // In development, return mock data
  if (import.meta.env.DEV) {
    return {
      bookings: [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 52 },
        { month: 'Mar', count: 48 },
        { month: 'Apr', count: 58 },
        { month: 'May', count: 62 },
        { month: 'Jun', count: 55 },
      ],
      satisfaction: [
        { rating: 1, count: 2 },
        { rating: 2, count: 5 },
        { rating: 3, count: 15 },
        { rating: 4, count: 48 },
        { rating: 5, count: 82 },
      ],
      metrics: {
        activeAMCs: 234,
        completedServices: 892,
        averageRating: 4.3,
      },
    };
  }

  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const response = await axios.get('/api/admin/analytics', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const response = await axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const deactivateUser = async (userId: string): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await axios.post(`/api/admin/users/${userId}/deactivate`, null, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
  } catch (error) {
    console.error('Failed to deactivate user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return a plain object without any non-cloneable data
    return {
      id: userId,
      firstName: updates.firstName || '',
      lastName: updates.lastName || '',
      email: updates.email || '',
      phone: updates.phone || '',
      role: 'user',
      amcStatus: 'active',
      lastServiceDate: '2024-02-15',
      nextServiceDate: '2024-05-15',
    } as User;
  }

  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const response = await axios.put(`/api/admin/users/${userId}`, updates, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export const deleteBuildVersions = async (versionIds: string[]): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    await axios.post('/api/admin/build/delete-bulk', { versionIds }, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
  } catch (error) {
    console.error('Failed to delete build versions:', error);
    throw error;
  }
};

export const suggestNextAppointment = (lastServiceDate: Date, intervalWeeks: number): Date => {
  const nextDate = new Date(lastServiceDate);
  nextDate.setDate(nextDate.getDate() + (intervalWeeks * 7));
  return nextDate;
};

interface BuildVersion {
  id: string;
  version: string;
  buildNumber: number;
  timestamp: string;
  files: string[];
  active: boolean;
  metadata: {
    gitCommit?: string;
    environment: string;
    buildTime: string;
    compiler: string;
    dependencies: Record<string, string>;
  };
  stats: {
    size: number;
    fileCount: number;
    compressedSize: number;
  };
}

const validateBuildVersion = (version: BuildVersion): boolean => {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return (
    semverRegex.test(version.version) &&
    version.buildNumber > 0 &&
    version.metadata.environment !== undefined &&
    version.stats.size > 0
  );
};

export const uploadBuildVersion = async (
  files: FileList,
  onProgress?: (progress: number) => void
): Promise<BuildVersion> => {
  const formData = new FormData();
  const zipFile = Array.from(files).find(f => f.name.endsWith('.zip'));
  
  if (!zipFile) {
    throw new Error('Please upload a ZIP file containing the build files');
  }

  // Validate file size
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (zipFile.size > maxSize) {
    throw new Error('Build file exceeds 100MB limit');
  }

  formData.append('build', zipFile);
  
  // Generate build metadata
  const metadata = {
    environment: import.meta.env.MODE,
    buildTime: new Date().toISOString(),
    compiler: 'vite',
    dependencies: JSON.parse(await readPackageJson())
  };
  
  formData.append('metadata', JSON.stringify(metadata));

  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const response = await axios.post('/api/admin/build/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user.token}`
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      }
    });

    const version = response.data;
    
    if (!validateBuildVersion(version)) {
      throw new Error('Invalid server response');
    }

    return version;
  } catch (error) {
    console.error('Failed to upload build:', error);
    if (axios.isAxiosError(error) && error.response?.status === 413) {
      throw new Error('Build file is too large. Maximum size is 100MB.');
    }
    throw error;
  }
};

export const fetchBuildVersions = async (): Promise<BuildVersion[]> => {
  if (import.meta.env.DEV) {
    return [
      {
        id: '1',
        version: '1.0.0',
        buildNumber: 1,
        timestamp: new Date().toISOString(),
        files: ['index.html', 'main.js', 'style.css'],
        active: true,
        metadata: {
          environment: 'development',
          buildTime: new Date().toISOString(),
          compiler: 'vite',
          dependencies: {}
        },
        stats: {
          size: 1024 * 1024,
          fileCount: 3,
          compressedSize: 512 * 1024
        }
      },
      {
        id: '2',
        version: '0.9.0',
        buildNumber: 2,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        files: ['index.html', 'main.js', 'style.css'],
        active: false,
        metadata: {
          environment: 'development',
          buildTime: new Date(Date.now() - 86400000).toISOString(),
          compiler: 'vite',
          dependencies: {}
        },
        stats: {
          size: 1024 * 1024,
          fileCount: 3,
          compressedSize: 512 * 1024
        }
      }
    ];
  }
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const response = await axios.get('/api/admin/build/versions', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    
    // Validate all versions
    const versions = response.data;
    if (!versions.every(validateBuildVersion)) {
      throw new Error('Invalid version data received');
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch build versions:', error);
    throw error;
  }
};

export const rollbackBuild = async (versionId: string): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    await axios.post(`/api/admin/build/rollback/${versionId}`, null, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
  } catch (error) {
    console.error('Failed to rollback build:', error);
    throw error;
  }
};