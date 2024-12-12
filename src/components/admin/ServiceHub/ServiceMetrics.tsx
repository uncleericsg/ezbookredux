import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

const ServiceMetrics: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      title: 'Completion Rate',
      value: '94%',
      trend: 2.5,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-400',
    },
    {
      title: 'Average Response Time',
      value: '2.5 hrs',
      trend: -0.5,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-400',
    },
    {
      title: 'Pending Services',
      value: 15,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Service Metrics</h2>
        <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">{metric.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-2xl font-semibold">{metric.value}</p>
                  {metric.trend && (
                    <div className={`flex items-center text-sm ${metric.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className={`h-4 w-4 ${metric.trend > 0 ? '' : 'transform rotate-180'}`} />
                      <span>{Math.abs(metric.trend)}%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-opacity-10 ${metric.color} bg-current`}>
                {React.cloneElement(metric.icon as React.ReactElement, {
                  className: `h-5 w-5 ${metric.color}`,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional metrics or charts can be added here */}
    </div>
  );
};

export default ServiceMetrics;
