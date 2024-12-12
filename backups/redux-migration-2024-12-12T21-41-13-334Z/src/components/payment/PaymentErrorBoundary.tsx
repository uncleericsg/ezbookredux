import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PaymentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Payment Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-900 rounded-lg p-6 border border-red-500">
          <div className="flex items-center space-x-3 text-red-500 mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Payment System Error</h3>
          </div>
          <p className="text-gray-300 mb-4">
            We're having trouble loading the payment system. This might be due to:
          </p>
          <ul className="list-disc list-inside text-gray-400 mb-6 space-y-2">
            <li>A temporary connection issue</li>
            <li>Browser security settings</li>
            <li>Ad-blockers or similar extensions</li>
          </ul>
          <div className="space-y-4">
            <p className="text-gray-300">
              Try refreshing the page or temporarily disabling any ad-blockers.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PaymentErrorBoundary;
