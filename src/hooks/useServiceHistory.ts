import { useState, useEffect } from 'react';
import { fetchServiceReports } from '../services/repairShopr';
import type { ServiceVisit } from '../types';

export const useServiceHistory = (userId: string) => {
  const [visits, setVisits] = useState<ServiceVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVisits = async () => {
      try {
        setLoading(true);
        const reports = await fetchServiceReports(userId);
        setVisits(reports);
      } catch (error) {
        console.error('Failed to load service history:', error);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadVisits();
    }
  }, [userId]);

  return { visits, loading };
};

export default useServiceHistory;