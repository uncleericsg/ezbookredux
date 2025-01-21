import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      // Handle function fallback
      if (typeof fallback === 'function') {
        return fallback(error);
      }
      // Handle component fallback
      if (fallback) {
        return fallback;
      }
      // Default fallback
      return <ErrorFallback error={error} />;
    }

    return children;
  }
}
