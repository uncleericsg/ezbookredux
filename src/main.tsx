import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import EnhancedErrorBoundary from './components/EnhancedErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { store, persistor } from './store/store';
import RouterComponent from './router';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <EnhancedErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </EnhancedErrorBoundary>
  </React.StrictMode>
);