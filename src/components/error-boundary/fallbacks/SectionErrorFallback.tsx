import React from 'react';

interface Props {
  error: Error;
  section: string;
  resetErrorBoundary: () => void;
}

export const SectionErrorFallback: React.FC<Props> = ({
  error,
  section,
  resetErrorBoundary
}) => {
  return (
    <div className="p-6 bg-gray-800/50 border border-gray-700/70 rounded-xl backdrop-blur-sm">
      <h3 className="text-xl font-bold text-[#FFD700] mb-3">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-300 mb-4">
        {section} section is temporarily unavailable
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-[#FFD700] text-gray-900 rounded-md hover:bg-yellow-500 transition-colors"
      >
        Try Again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 p-4 bg-gray-800/80 rounded text-sm text-gray-400 overflow-auto">
          {error.message}
          {'\n'}
          {error.stack}
        </pre>
      )}
    </div>
  );
};