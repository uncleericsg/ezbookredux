import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminView } from '../../contexts/AdminViewContext';
import ViewSelector from './ViewSelector';

export type UserViewType = 'non-user' | 'regular' | 'amc' | 'admin';

const AdminViewToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { currentView, setCurrentView, resetView } = useAdminView();

  // Only show in development mode and for admin users in production
  if (process.env.NODE_ENV === 'production' && user?.role !== 'admin') {
    return null;
  }

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
          onViewChange={setCurrentView}
          onClose={() => {
            setIsOpen(false);
            if (process.env.NODE_ENV === 'production') {
              resetView();
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminViewToggle;
