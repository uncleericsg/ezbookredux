import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <p className="text-red-500 font-medium">Something went wrong</p>
      <p className="text-sm text-red-400 mt-1">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  onReset?: () => void;
}

export function ErrorBoundary({ children, FallbackComponent = ErrorFallback, onReset }: ErrorBoundaryProps) {
  const handleReset = () => {
    onReset?.();
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onReset={handleReset}
      onError={(error) => {
        console.error('Error caught by ErrorBoundary:', error);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
