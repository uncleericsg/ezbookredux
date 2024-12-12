import React from 'react';
import { Clock } from 'lucide-react';

interface Service {
  id: string;
  type: string;
  date: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

const ServiceHistory: React.FC = () => {
  // Mock data - replace with actual data
  const services: Service[] = [
    {
      id: '1',
      type: 'Regular Maintenance',
      date: '2024-02-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'AMC Service',
      date: '2024-03-01',
      status: 'scheduled'
    },
    {
      id: '3',
      type: 'Emergency Repair',
      date: '2024-01-30',
      status: 'completed'
    }
  ];

  const getStatusStyle = (status: Service['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Recent Activity</h2>

      <div className="space-y-4">
        {services.map((service) => (
          <div 
            key={service.id}
            className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-4 border border-gray-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-gray-500/20"></div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{service.type}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  {new Date(service.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHistory;
