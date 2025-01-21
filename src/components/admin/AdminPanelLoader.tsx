import React from 'react';
import type { AdminLoadingProps } from '../../shared/types/admin';

const AdminPanelLoader: React.FC<AdminLoadingProps> = ({ 
  message = 'Loading...',
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}
      />
      {message && (
        <p className="mt-4 text-gray-400 text-sm">
          {message}
        </p>
      )}
    </div>
  );
};

AdminPanelLoader.displayName = 'AdminPanelLoader';

export { AdminPanelLoader };
export default AdminPanelLoader;
