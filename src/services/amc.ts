import axios from 'axios';
import { resetVisitLabels } from './repairShopr';
import { toast } from 'sonner';
import type { AMCPackage, ServiceVisit } from '../types';

const checkRenewalStatus = (visits: ServiceVisit[]): { 
  shouldRemind: boolean; 
  isLastVisit: boolean;
} => {
  const completedVisits = visits.filter(v => v.status === 'completed').length;
  const scheduledVisits = visits.filter(v => v.status === 'scheduled').length;
  
  return {
    shouldRemind: completedVisits === 3 && scheduledVisits === 1,
    isLastVisit: completedVisits === 3 || (completedVisits === 3 && scheduledVisits === 1)
  };
};

export const renewAMC = async (packageId: string): Promise<void> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  }

  try {
    // First renew the AMC package
    await axios.post('/api/amc/renew', { packageId });
    
    // Then reset visit labels in RepairShopr
    await resetVisitLabels(packageId);
  } catch (error) {
    console.error('Failed to renew AMC:', error);
    throw error;
  }
};

export const fetchServiceVisits = async (userId: string): Promise<ServiceVisit[]> => {
  if (import.meta.env.DEV) {
    return [
      {
        id: '1',
        date: '2024-02-15',
        label: '#1ST VISIT',
        status: 'completed',
        notes: 'Regular maintenance completed',
      },
      {
        id: '2',
        date: '2024-05-15',
        label: '#2ND VISIT',
        status: 'scheduled',
      },
    ];
  }

  try {
    const response = await axios.get(`/api/service-visits/${userId}`);
    const visits = response.data;
    
    // Check renewal status
    const { shouldRemind, isLastVisit } = checkRenewalStatus(visits);
    
    if (shouldRemind) {
      toast.warning(
        'Your next service will be your final AMC visit. Please renew your package to continue enjoying AMC benefits.',
        { duration: 10000 }
      );
    }
    
    if (isLastVisit) {
      toast.error(
        'This is your final AMC visit. Renew now to maintain continuous coverage and early renewal benefits.',
        { duration: 10000 }
      );
    }
    
    return visits;
  } catch (error) {
    console.error('Failed to fetch service visits:', error);
    return [];
  }
};