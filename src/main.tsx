import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from '@components/error-boundary';
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

const AppErrorFallback = ({ error }: { error: Error }) => (
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
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 p-4 bg-gray-800 rounded text-left text-sm text-gray-400 overflow-auto">
          {error.message}
          {'\n'}
          {error.stack}
        </pre>
      )}
    </div>
  </div>
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={(error) => <AppErrorFallback error={error} />}
      onError={(error) => {
        console.error('Application Error:', error);
        // You can add error reporting service here
      }}
    >
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
    </ErrorBoundary>
  </React.StrictMode>
);