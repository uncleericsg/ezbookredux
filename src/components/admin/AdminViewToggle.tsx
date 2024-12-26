import React, { useState } from 'react';

import ViewSelector from '@admin/ViewSelector';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentView, resetView, type UserViewType } from '@store/slices/adminSlice';

const AdminViewToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { currentView } = useAppSelector((state) => state.admin);

  // Only show in development mode and for admin users in production
  if (process.env.NODE_ENV === 'production' && user?.role !== 'admin') {
    return null;
  }

  const handleViewChange = (view: UserViewType) => {
    dispatch(setCurrentView(view));
    setIsOpen(false);
  };

  const handleResetView = () => {
    dispatch(resetView());
    setIsOpen(false);
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
          onReset={handleResetView}
        />
      )}
    </div>
  );
};

AdminViewToggle.displayName = 'AdminViewToggle';

export { AdminViewToggle };
export default AdminViewToggle;
