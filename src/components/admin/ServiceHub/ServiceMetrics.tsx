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
      icon: <CheckCircle />,
      color: 'text-green-400',
    },
    {
      title: 'Average Response Time',
      value: '2.5 hrs',
      trend: -0.5,
      icon: <Clock />,
      color: 'text-blue-400',
    },
    {
      title: 'Pending Services',
      value: 15,
      icon: <AlertTriangle />,
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded bg-opacity-10 ${metric.color} bg-current`}>
                  {React.cloneElement(metric.icon as React.ReactElement, {
                    className: `h-4 w-4 ${metric.color}`,
                  })}
                </div>
                <h3 className="text-sm font-medium text-gray-400">{metric.title}</h3>
              </div>
              {metric.trend && (
                <span className={`text-xs font-medium ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}%
                </span>
              )}
            </div>
            <p className="text-lg font-semibold text-white mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Additional metrics or charts can be added here */}
    </div>
  );
};

export default ServiceMetrics;
