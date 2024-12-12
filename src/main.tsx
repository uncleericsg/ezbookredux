import React, { StrictMode, Suspense, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import RouterComponent from './router';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { UserProvider } from './contexts/UserContext';
import { store } from './store';
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

const root = ReactDOM.createRoot(rootElement);

startTransition(() => {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LoadingScreen />}>
              <RouterComponent>
                <UserProvider>
                  <Toaster position="top-right" />
                </UserProvider>
              </RouterComponent>
            </Suspense>
          </QueryClientProvider>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  );
});