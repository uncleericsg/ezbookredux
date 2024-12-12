import React from 'react';
import { Save, Loader2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import ColorPicker from '../ColorPicker';
import LogoUploader from './LogoUploader';
import { useBrandingSettings } from '../../hooks/useBrandingSettings';
import BrandingPreview from './BrandingPreview';

const BrandingSettings: React.FC = () => {
  const {
    settings,
    loading,
    preview,
    updateSettings,
    handleLogoChange,
  } = useBrandingSettings();

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Brand Colors</h2>
          <Palette className="h-6 w-6 text-blue-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Primary Color
            </label>
            <ColorPicker
              color={settings.primaryColor}
              onChange={(color) => updateSettings({ primaryColor: color })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Secondary Color
            </label>
            <ColorPicker
              color={settings.secondaryColor}
              onChange={(color) => updateSettings({ secondaryColor: color })}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Logo Management</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Website Logo</h3>
            <LogoUploader
              type="website"
              currentLogo={preview}
              onUpload={handleLogoChange}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Web App Logo</h3>
            <LogoUploader
              type="webapp"
              currentLogo={preview}
              onUpload={handleLogoChange}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Favicon</h3>
            <LogoUploader
              type="favicon"
              currentLogo={preview}
              onUpload={handleLogoChange}
            />
          </div>
        </div>
      </div>

      <BrandingPreview
        primaryColor={settings.primaryColor}
        secondaryColor={settings.secondaryColor}
        logo={preview}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <button
          onClick={() => updateSettings(settings)}
          disabled={loading}
          className="btn btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default BrandingSettings;