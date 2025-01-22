import axios from 'axios';
import { resetVisitLabels } from '@services/repairShopr';
import { toast } from 'sonner';
import type { AMCPackage, ServiceVisit, RenewalStatus } from '@/types/amc';
import { handleDatabaseError } from '@/utils/apiErrors';

const checkRenewalStatus = (visits: ServiceVisit[]): RenewalStatus => {
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
    throw handleDatabaseError({
      code: 'RENEWAL_FAILED',
      message: 'Failed to renew AMC package',
      originalError: error
    });
  }
};

export const fetchServiceVisits = async (userId: string): Promise<ServiceVisit[]> => {
  if (import.meta.env.DEV) {
    const mockVisits: ServiceVisit[] = [
      {
        id: '1',
        date: '2024-02-15',
        label: '#1ST VISIT',
        status: 'completed',
        notes: 'Regular maintenance completed',
        packageId: 'mock-package-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        date: '2024-05-15',
        label: '#2ND VISIT',
        status: 'scheduled',
        packageId: 'mock-package-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
    return mockVisits;
  }

  try {
    const response = await axios.get<ServiceVisit[]>(`/api/service-visits/${userId}`);
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
    throw handleDatabaseError({
      code: 'FETCH_VISITS_FAILED',
      message: 'Failed to fetch service visits',
      originalError: error
    });
  }
};