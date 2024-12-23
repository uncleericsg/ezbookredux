import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import { LoadingScreen } from './components/LoadingScreen';
import { useServiceManager } from './hooks/useServiceManager';
import { useInitializeAuth } from './hooks/useInitializeAuth';
import { useAppSelector } from './store';
import { AdminViewProvider } from './contexts/AdminViewContext';

function App() {
  // Initialize auth state
  useInitializeAuth();

  const { loading: authLoading } = useAppSelector(state => state.auth);
  const { isInitializing, error } = useServiceManager({
    services: ['auth', 'firestore'],
    retryAttempts: 3,
    retryDelay: 1000,
  });

  // Show loading screen while initializing services
  if (isInitializing || authLoading) {
    return <LoadingScreen />;
  }

  // Show error screen if service initialization failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Service Error</h1>
          <p className="text-gray-400">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminViewProvider>
      <ScrollToTop />
      <Outlet />
      <Toaster position="top-center" />
    </AdminViewProvider>
  );
}

export default App;