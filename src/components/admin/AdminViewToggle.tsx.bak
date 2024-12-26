import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCurrentView, resetView, type UserViewType } from '@store/slices/adminSlice';
import ViewSelector from './ViewSelector';

interface AdminViewToggleProps {
  className?: string;
}

const AdminViewToggle = ({ className = '' }: AdminViewToggleProps) => {
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

  const viewLabels: Record<UserViewType, string> = {
    'non-user': 'Non-User View',
    'regular': 'Regular User',
    'amc': 'AMC User',
    'admin': 'Admin View'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-colors"
        title="Change view mode"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{viewLabels[currentView]}</span>
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

AdminViewToggle.displayName = 'AdminViewToggle';

export { AdminViewToggle };
export default AdminViewToggle;
