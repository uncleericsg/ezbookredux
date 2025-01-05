import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  section: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Section-specific error boundary with fallback UI and error reporting
 */
class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to error reporting service
    console.error(`Error in ${this.props.section} section:`, error, info);
    
    // TODO: Send to error tracking service
    // reportError({
    //   error,
    //   info,
    //   section: this.props.section,
    //   timestamp: new Date().toISOString()
    // });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-gray-800/50 border border-gray-700/70 rounded-xl backdrop-blur-sm">
          <h3 className="text-xl font-bold text-[#FFD700] mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-300 mb-4">
            {this.props.section} section is temporarily unavailable
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-[#FFD700] text-gray-900 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;