import React from 'react';
import { Tag } from 'lucide-react';

interface ServiceVisitLabelProps {
  visitNumber: number;
  status: 'completed' | 'scheduled' | 'cancelled';
}

const ServiceVisitLabel: React.FC<ServiceVisitLabelProps> = ({ visitNumber, status }) => {
  const getSuffix = (num: number) => {
    const suffixes = ['ST', 'ND', 'RD', 'TH'];
    return num <= 3 ? suffixes[num - 1] : suffixes[3];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'scheduled':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
      <Tag className="h-4 w-4" />
      <span className="text-sm font-medium">
        #{visitNumber}
        {getSuffix(visitNumber)} VISIT
      </span>
    </div>
  );
};

export default ServiceVisitLabel;