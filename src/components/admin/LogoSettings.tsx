import React from 'react';
import { Image, Save, Loader2 } from 'lucide-react';
import LogoUploader from './LogoUploader';
import useLogo from '../../hooks/useLogo';
import { toast } from 'sonner';

const LogoSettings: React.FC = () => {
  const { uploadLogo, getLogo, loading } = useLogo({
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    onSuccess: () => toast.success('Logo settings saved successfully'),
    onError: () => toast.error('Failed to save logo settings')
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Logo Settings</h2>
        <Image className="h-6 w-6 text-blue-400" />
      </div>

      <div className="space-y-8">
        {/* Website Logo */}
        <div>
          <h3 className="text-lg font-medium mb-2">Website Logo</h3>
          <p className="text-sm text-gray-400 mb-4">
            Recommended size: 180x40px, SVG or PNG format
          </p>
          <LogoUploader
            type="website"
            currentLogo={getLogo('website')}
            onUpload={(file) => uploadLogo(file, 'website')}
            allowedTypes={['image/png', 'image/svg+xml']}
            maxSize={1 * 1024 * 1024}
          />
        </div>

        {/* Web App Logo */}
        <div>
          <h3 className="text-lg font-medium mb-2">Web App Logo</h3>
          <p className="text-sm text-gray-400 mb-4">
            Required size: 512x512px, PNG format for PWA icon
          </p>
          <LogoUploader
            type="webapp"
            currentLogo={getLogo('webapp')}
            onUpload={(file) => uploadLogo(file, 'webapp')}
            allowedTypes={['image/png']}
            maxSize={2 * 1024 * 1024}
            minDimensions={{ width: 512, height: 512 }}
          />
        </div>

        {/* Favicon */}
        <div>
          <h3 className="text-lg font-medium mb-2">Favicon</h3>
          <p className="text-sm text-gray-400 mb-4">
            Required size: 32x32px, ICO or PNG format
          </p>
          <LogoUploader
            type="favicon"
            currentLogo={getLogo('favicon')}
            onUpload={(file) => uploadLogo(file, 'favicon')}
            allowedTypes={['image/x-icon', 'image/png']}
            maxSize={100 * 1024}
            exactDimensions={{ width: 32, height: 32 }}
          />
        </div>
      </div>
    </div>
  );
};

export default LogoSettings;