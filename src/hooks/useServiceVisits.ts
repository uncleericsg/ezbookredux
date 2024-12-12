import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { fetchServiceReports, updateServiceReport, incrementVisitLabel } from '../services/repairShopr';
import { useToast } from './useToast';
import type { ServiceVisit } from '../types';

export const useServiceVisits = () => {
  const { user } = useUser();
  const [visits, setVisits] = useState<ServiceVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const loadVisits = async () => {
      try {
        setLoading(true);
        const reports = await fetchServiceReports(user.id);
        setVisits(reports);
      } catch (error) {
        toast.showError('Failed to load service visits');
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, [user?.id]);

  const completeVisit = async (visitId: string, notes?: string) => {
    try {
      await updateServiceReport(visitId, 'completed', notes);
      await incrementVisitLabel(user?.id || '');
      
      // Refresh visits
      const updatedVisits = await fetchServiceReports(user?.id || '');
      setVisits(updatedVisits);
      
      toast.showSuccess('Service visit completed');
    } catch (error) {
      toast.showError('Failed to complete service visit');
      throw error;
    }
  };

  return {
    visits,
    loading,
    completeVisit,
  };
};