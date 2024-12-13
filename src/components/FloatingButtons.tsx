import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { ROUTES } from '../config/routes';
import { Settings, MessageCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const FloatingButtons: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.user);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const pathname = location.pathname;
  const isLoginPage = pathname === ROUTES.LOGIN;
  const showAuthButtons = !isLoginPage && isAuthenticated;

  if (!showAuthButtons) {
    return null;
  }

  const handleAdminSettings = () => {
    navigate('/admin/settings');
  };

  const handleSupportChat = () => {
    toast.info('Support chat feature coming soon!');
  };

  const handleHelpCenter = () => {
    navigate('/help');
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {currentUser?.role === 'admin' && (
        <button
          onClick={handleAdminSettings}
          className="p-3 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200 ease-in-out hover:scale-110"
          title="Admin Settings"
          aria-label="Admin Settings"
        >
          <Settings className="h-6 w-6 text-white" />
        </button>
      )}
      <button
        onClick={handleSupportChat}
        className="p-3 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out hover:scale-110"
        title="Support Chat"
        aria-label="Support Chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={handleHelpCenter}
        className="p-3 rounded-full shadow-lg bg-green-600 hover:bg-green-700 transition-all duration-200 ease-in-out hover:scale-110"
        title="Help Center"
        aria-label="Help Center"
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default FloatingButtons;