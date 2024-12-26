import { Plus, Filter, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import React, { useState } from 'react';

import ContractMonitoring from '@admin/ServiceHub/ContractMonitoring';
import ServiceMetrics from '@admin/ServiceHub/ServiceMetrics';
import ServiceQueue from '@admin/ServiceHub/ServiceQueue';

const ServiceHub: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'queue' | 'contracts'>('split');

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Section: Controls and Metrics */}
      <div className="flex-none">
        {/* Controls */}
        <div className="mb-6 flex justify-end items-center space-x-4 px-1">
          <select 
            className="bg-gray-700 rounded-lg px-3.5 py-2 text-sm text-gray-200 border border-gray-600 focus:outline-none focus:border-blue-500"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
          >
            <option value="split">Split View</option>
            <option value="queue">Queue Focus</option>
            <option value="contracts">Contracts Focus</option>
          </select>
          <button 
            className="flex items-center space-x-2 px-3.5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-gray-200 text-sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-3.5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Service</span>
          </button>
        </div>

        {/* Service Metrics Overview */}
        <div className="mb-36 px-1">
          <div className="h-[9.5vh]">
            <ServiceMetrics key={`metrics-${refreshKey}`} />
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`grid gap-6 px-1 mb-8 ${
          viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {/* Service Queue Panel */}
          {(viewMode === 'split' || viewMode === 'queue') && (
            <div className="h-[70vh] flex flex-col bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex-none flex justify-between items-center px-4 py-3 border-b border-gray-700">
                <h2 className="text-base font-semibold text-white">Service Queue</h2>
                {viewMode === 'split' ? (
                  <button
                    onClick={() => setViewMode('queue')}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode('split')}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <div className="h-full overflow-auto p-4">
                  <ServiceQueue key={`queue-${refreshKey}`} />
                </div>
              </div>
            </div>
          )}
          
          {/* Contract Monitoring Panel */}
          {(viewMode === 'split' || viewMode === 'contracts') && (
            <div className="h-[70vh] flex flex-col bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex-none flex justify-between items-center px-4 py-3 border-b border-gray-700">
                <h2 className="text-base font-semibold text-white">Contract Monitoring</h2>
                {viewMode === 'split' ? (
                  <button
                    onClick={() => setViewMode('contracts')}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode('split')}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <div className="h-full overflow-auto p-4">
                  <ContractMonitoring key={`contracts-${refreshKey}`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceHub;
