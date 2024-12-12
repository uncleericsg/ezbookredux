import React from 'react';
import { Calendar, Webhook, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { useAcuityTesting } from '../../hooks/useAcuityTesting';
import type { AcuitySettings } from '../../types/settings';

interface AcuityTesterProps {
  settings: AcuitySettings;
}

const AcuityTester: React.FC<AcuityTesterProps> = ({ settings }) => {
  const {
    loading,
    results,
    testConnection,
    testBookingFlow,
    testWebhooks,
    clearResults
  } = useAcuityTesting(settings);

  return (
    <div className="space-y-6">
      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h3 className="text-green-400 font-medium mb-1">Successful Tests</h3>
          <p className="text-2xl font-bold">{results.success}</p>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-medium mb-1">Failed Tests</h3>
          <p className="text-2xl font-bold">{results.failed}</p>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-1">Last Sync</h3>
          <p className="text-sm">
            {results.lastSync ? new Date(results.lastSync).toLocaleString() : 'Never'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {results.errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-medium text-red-400">Test Errors</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-400">
            {results.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="btn btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
          <span>Test Connection</span>
        </button>

        <button
          onClick={testBookingFlow}
          disabled={loading}
          className="btn btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Calendar className="h-5 w-5" />
          )}
          <span>Test Booking Flow</span>
        </button>

        <button
          onClick={testWebhooks}
          disabled={loading}
          className="btn btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Webhook className="h-5 w-5" />
          )}
          <span>Test Webhooks</span>
        </button>
      </div>

      {/* Clear Results */}
      <div className="flex justify-end">
        <button
          onClick={clearResults}
          disabled={loading}
          className="btn btn-secondary"
        >
          Clear Test Results
        </button>
      </div>
    </div>
  );
};

export default AcuityTester;