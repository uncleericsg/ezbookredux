import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import ConsolidatedErrorBoundary from './components/ConsolidatedErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { store, persistor } from './store/store';
import RouterComponent from './router';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import './index.css';

// Match the working version's QueryClient config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Default error fallback UI
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-4">Please refresh the page to try again.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ConsolidatedErrorBoundary fallback={<ErrorFallback />} useEnhancedFeatures={true}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <Suspense fallback={<LoadingScreen />}>
              <RouterComponent />
              <Toaster
                position="top-center"
                theme="dark"
                expand={true}
                closeButton={false}
                duration={2000}
                style={{
                  background: '#1F2937',
                  border: '1px solid #374151',
                  color: '#F3F4F6',
                }}
                className="dark-toast"
              />
              <SpeedInsights />
              <Analytics />
            </Suspense>
          </PersistGate>
        </QueryClientProvider>
      </Provider>
    </ConsolidatedErrorBoundary>
  </React.StrictMode>
);