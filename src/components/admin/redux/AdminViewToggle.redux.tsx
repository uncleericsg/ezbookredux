import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store/hooks';
import ViewSelector from '../ViewSelector';
import type { UserViewType } from '../AdminViewToggle';
import { RootState } from '../../../store';

export const AdminViewToggleRedux: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  const { isAdmin, adminData } = useSelector((state: RootState) => state.admin);
  const currentView = useSelector((state: RootState) => state.adminView.currentView);

  // Only show in development mode and for admin users in production
  if (process.env.NODE_ENV === 'production' && !isAdmin) {
    return null;
  }

  const handleViewChange = (view: UserViewType) => {
    dispatch({ type: 'adminView/setCurrentView', payload: view });
  };

  const resetView = () => {
    dispatch({ type: 'adminView/resetView' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>View As: {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</span>
        </div>
      </button>

      {isOpen && (
        <ViewSelector
          currentView={currentView}
          onViewChange={handleViewChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Add displayName
AdminViewToggleRedux.displayName = 'AdminViewToggleRedux';

// Export both named and default
export default AdminViewToggleRedux;
