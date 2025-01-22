import type { IconProps } from 'lucide-react';

/**
 * Service status type
 */
export type ServiceStatus = 'completed' | 'scheduled' | 'cancelled';

/**
 * Service interface
 */
export interface Service {
  id: string;
  type: string;
  date: string;
  status: ServiceStatus;
}

/**
 * Service history props interface
 */
export interface ServiceHistoryProps {
  className?: string;
  services?: Service[];
}

/**
 * Service history item props interface
 */
export interface ServiceHistoryItemProps {
  service: Service;
}

/**
 * Get status style utility
 */
export const getStatusStyle = (status: ServiceStatus): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-400';
    case 'scheduled':
      return 'bg-blue-500/10 text-blue-400';
    case 'cancelled':
      return 'bg-red-500/10 text-red-400';
  }
};

/**
 * Format date utility
 */
export const formatServiceDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};