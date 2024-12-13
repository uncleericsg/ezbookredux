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

  if (isInitializing || authLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            {error.message || 'An error occurred while initializing the app'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminViewProvider>
      <div className="App min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="relative">
          <ScrollToTop />
          <Toaster position="top-center" />
          <Outlet />
        </div>
      </div>
    </AdminViewProvider>
  );
}

export default App;