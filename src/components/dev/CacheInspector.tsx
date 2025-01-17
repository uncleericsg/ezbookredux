import React, { useState, useEffect } from 'react';
import { monitor, inspectCache } from '../../utils/cacheUtils';
import { DEV_TOOLS, PERFORMANCE_THRESHOLDS } from '../../config/cacheConfig';
import { AlertTriangle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { CacheEntry } from '@/utils/cache';

interface CacheData {
  key: string;
  value: unknown;
  timestamp: number;
  ttl: number;
}

interface CacheInspectorProps {
  cache: Map<string, any>;
  onClearCache?: () => void;
}

const CacheInspector: React.FC<CacheInspectorProps> = ({ cache, onClearCache }) => {
  const [metrics, setMetrics] = useState(monitor.getMetrics());
  const [inspection, setInspection] = useState(inspectCache(cache));
  const [expanded, setExpanded] = useState(false);
  const [cacheData, setCacheData] = useState<CacheData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CacheData | null>(null);

  useEffect(() => {
    if (!DEV_TOOLS.enabled) return;

    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
      setInspection(inspectCache(cache));
    }, 1000);

    return () => clearInterval(interval);
  }, [cache]);

  useEffect(() => {
    const updateCacheData = () => {
      const entries: CacheData[] = [];
      // Implementation of cache data collection
      setCacheData(entries);
    };

    updateCacheData();
    const interval = setInterval(updateCacheData, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!DEV_TOOLS.enabled) return null;

  const hitRate = metrics.hits / (metrics.hits + metrics.misses) || 0;
  const evictionRate = metrics.evictions / metrics.size || 0;
  const isPerformanceGood = 
    hitRate >= PERFORMANCE_THRESHOLDS.hitRate &&
    metrics.averageAccessTime <= PERFORMANCE_THRESHOLDS.maxLatency &&
    evictionRate <= PERFORMANCE_THRESHOLDS.evictionRate;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-lg p-4 max-w-md text-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center gap-2">
          {isPerformanceGood ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          )}
          Cache Inspector
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              monitor.reset();
              onClearCache?.();
            }}
            className="p-1 hover:bg-gray-700 rounded"
            title="Clear Cache"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-xs text-gray-400">Hit Rate</div>
            <div className={hitRate >= PERFORMANCE_THRESHOLDS.hitRate ? 'text-green-400' : 'text-yellow-400'}>
              {(hitRate * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-xs text-gray-400">Avg Latency</div>
            <div className={metrics.averageAccessTime <= PERFORMANCE_THRESHOLDS.maxLatency ? 'text-green-400' : 'text-yellow-400'}>
              {metrics.averageAccessTime.toFixed(2)}ms
            </div>
          </div>
        </div>

        {expanded && (
          <>
            <div className="bg-gray-700 p-2 rounded mt-2">
              <div className="text-xs text-gray-400">Cache Size</div>
              <div className="flex justify-between">
                <span>{inspection.size} entries</span>
                <span className="text-gray-400">
                  {inspection.expiringWithin['1min']} expiring soon
                </span>
              </div>
            </div>

            <div className="bg-gray-700 p-2 rounded mt-2">
              <div className="text-xs text-gray-400">Statistics</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Hits: {metrics.hits}</div>
                <div>Misses: {metrics.misses}</div>
                <div>Evictions: {metrics.evictions}</div>
                <div>Size: {metrics.size}</div>
              </div>
            </div>

            {inspection.oldestEntry && (
              <div className="bg-gray-700 p-2 rounded mt-2">
                <div className="text-xs text-gray-400">Oldest Entry</div>
                <div className="text-xs truncate">
                  {inspection.oldestEntry.key}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CacheInspector;
