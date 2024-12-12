import React, { Component, ErrorInfo } from 'react';
import { toast } from 'sonner';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  error: Error | null;
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      error,
      hasError: true
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('Error caught by boundary:', error, errorInfo);

    // Notify user
    toast.error('An error occurred. The application will try to recover.');

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      error: null,
      hasError: false
    });

    // Call onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use default error display
      return (
        <ErrorDisplay
          error={error || new Error('An unknown error occurred')}
          resetErrorBoundary={this.resetErrorBoundary}
          className="m-4"
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
