import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  useEnhancedFeatures?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ConsolidatedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    if (this.props.useEnhancedFeatures) {
      console.error('Uncaught error:', error, errorInfo);
      
      // Use dynamic import for toast to make it optional
      import('sonner').then(({ toast }) => {
        toast.error('An unexpected error occurred. Please try again.');
      }).catch(() => {
        console.warn('Toast library not available');
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.useEnhancedFeatures) {
        return (
          <div className="min-h-[200px] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="h-12 w-12 text-red-500 mx-auto mb-4">
                {/* Placeholder for AlertTriangle icon */}
                ⚠️
              </div>
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-gray-400 mb-4">
                We're sorry, but something unexpected happened. Please try again.
              </p>
              <button onClick={this.handleRetry} className="btn btn-primary flex items-center justify-center space-x-2 mx-auto">
                <span>↻</span> {/* Placeholder for RefreshCw icon */}
                <span>Try Again</span>
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <pre className="mt-4 p-4 bg-gray-800 rounded-lg text-left text-sm text-gray-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              )}
            </div>
          </div>
        );
      }

      return <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children;
  }
}

export default ConsolidatedErrorBoundary;