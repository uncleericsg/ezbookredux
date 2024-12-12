import React, { useState } from 'react';
import { Plus, Filter, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import ContractMonitoring from './ContractMonitoring';
import ServiceQueue from './ServiceQueue';
import ServiceMetrics from './ServiceMetrics';

const ServiceHub: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'queue' | 'contracts'>('split');

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Service Management</h1>
          <p className="text-gray-400">Monitor and manage all service operations</p>
        </div>
        <div className="flex space-x-3">
          <select 
            className="bg-gray-700 rounded-lg px-4 py-2 text-gray-200 border border-gray-600 focus:outline-none focus:border-blue-500"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
          >
            <option value="split">Split View</option>
            <option value="queue">Queue Focus</option>
            <option value="contracts">Contracts Focus</option>
          </select>
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-200"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>New Service</span>
          </button>
        </div>
      </div>

      {/* Service Metrics Overview */}
      <div className="mb-6">
        <ServiceMetrics key={`metrics-${refreshKey}`} />
      </div>

      {/* Main Content Grid */}
      <div className={`flex-1 min-h-0 grid gap-6 ${
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* Service Queue Panel */}
        {(viewMode === 'split' || viewMode === 'queue') && (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Service Queue</h2>
              {viewMode === 'split' ? (
                <button 
                  onClick={() => setViewMode('queue')}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="Expand"
                >
                  <Maximize2 className="h-4 w-4 text-gray-400" />
                </button>
              ) : (
                <button 
                  onClick={() => setViewMode('split')}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <ServiceQueue key={`queue-${refreshKey}`} />
            </div>
          </div>
        )}
        
        {/* Contract Monitoring Panel */}
        {(viewMode === 'split' || viewMode === 'contracts') && (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Contract Monitoring</h2>
              {viewMode === 'split' ? (
                <button 
                  onClick={() => setViewMode('contracts')}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="Expand"
                >
                  <Maximize2 className="h-4 w-4 text-gray-400" />
                </button>
              ) : (
                <button 
                  onClick={() => setViewMode('split')}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <ContractMonitoring key={`contracts-${refreshKey}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHub;
