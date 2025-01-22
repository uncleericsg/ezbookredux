import React from 'react';
import type { ServiceHistoryProps, Service } from '@/types/service-history';
import ServiceHistoryItem from './ServiceHistoryItem';

// Mock data - replace with actual data from props
const mockServices: Service[] = [
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

const ServiceHistory: React.FC<ServiceHistoryProps> = ({
  className,
  services = mockServices
}) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h2 className="text-xl font-bold text-white">Recent Activity</h2>
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceHistoryItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceHistory;
