import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnhancedErrorBoundary from './components/EnhancedErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { store } from './store';
import RouterComponent from './router';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <EnhancedErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingScreen />}>
            <RouterComponent />
            <SpeedInsights />
            <Analytics />
          </Suspense>
        </QueryClientProvider>
      </Provider>
    </EnhancedErrorBoundary>
  </React.StrictMode>
);