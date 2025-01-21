import React from 'react';
import type { AdminHeaderProps } from '../../shared/types/admin';

const AdminHeader: React.FC<AdminHeaderProps> = ({
  settings,
  loading,
  integrationStatus,
  onIntervalChange,
  updateSettings
}) => {
  const handleLogoUpdate = async (url: string) => {
    await updateSettings({
      branding: {
        ...settings.branding,
        logo: {
          ...settings.branding.logo,
          url
        }
      }
    });
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">
              Admin Dashboard
            </h1>
            {settings.branding.logo.url && (
              <img 
                src={settings.branding.logo.url} 
                alt="Logo"
                className="h-8"
                style={{
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity 0.2s'
                }}
              />
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {Object.entries(integrationStatus).map(([key, status]) => (
              <div 
                key={key}
                className={`px-3 py-1 rounded-full text-sm ${
                  status ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                }`}
              >
                {key}: {status ? 'Active' : 'Inactive'}
              </div>
            ))}
            
            <button
              onClick={onIntervalChange}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Update Interval
            </button>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </header>
  );
};

AdminHeader.displayName = 'AdminHeader';

export { AdminHeader };
export default AdminHeader;
