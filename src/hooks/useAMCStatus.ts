import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { fetchServiceVisits } from '../services/amc';
import { useToast } from './useToast';
import type { ServiceVisit } from '../types';

export const useAMCStatus = () => {
  const { user } = useUser();
  const [visits, setVisits] = useState<ServiceVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadVisits = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const serviceVisits = await fetchServiceVisits(user.id);
        setVisits(serviceVisits);
      } catch (error) {
        console.error('Failed to load AMC status:', error);
        toast.showError('Failed to load AMC status');
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, [user?.id]);

  const completedVisits = visits.filter(v => v.status === 'completed').length;
  const scheduledVisits = visits.filter(v => v.status === 'scheduled').length;
  const totalVisits = 4; // Standard package size
  const visitsRemaining = totalVisits - (completedVisits + scheduledVisits);
  const isLastVisit = completedVisits === 3;
  const isSecondToLast = completedVisits === 2;

  useEffect(() => {
    if (isSecondToLast) {
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
  }, [isLastVisit, isSecondToLast]);

  const getNextVisitNumber = () => {
    return completedVisits + scheduledVisits + 1;
  };

  const isEligibleForService = () => {
    return visitsRemaining > 0 && user?.amcStatus === 'active';
  };

  return {
    visits,
    loading,
    completedVisits,
    scheduledVisits,
    visitsRemaining,
    totalVisits,
    isLastVisit,
    isSecondToLast,
    getNextVisitNumber,
    isEligibleForService,
  };
};