import { useState, useEffect } from 'react';
import { fetchAMCPackages, fetchServiceVisits, renewAMC } from '@services/amc';
import { resetVisitLabels } from '@services/repairShopr';
import type { AMCPackage, ServiceVisit } from '@types';

export const useAMC = (userId: string) => {
  const [packages, setPackages] = useState<AMCPackage[]>([]);
  const [serviceVisits, setServiceVisits] = useState<ServiceVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAMCData = async () => {
      try {
        const [packagesData, visitsData] = await Promise.all([
          fetchAMCPackages(),
          fetchServiceVisits(userId),
        ]);
        setPackages(packagesData);
        setServiceVisits(visitsData);
      } catch (err) {
        setError('Failed to load AMC data');
      } finally {
        setLoading(false);
      }
    };

    loadAMCData();
  }, [userId]);

  const handleRenewal = async (packageId: string) => {
    try {
      await renewAMC(packageId, userId);
      // Reset visit labels in RepairShopr
      await resetVisitLabels(userId);
      // Refresh data after renewal
      const [packagesData, visitsData] = await Promise.all([
        fetchAMCPackages(),
        fetchServiceVisits(userId),
      ]);
      setPackages(packagesData);
      setServiceVisits(visitsData);
    } catch (err) {
      setError('Failed to renew AMC');
      throw err;
    }
  };

  const getRemainingVisits = () => {
    const completedVisits = serviceVisits.filter(v => v.status === 'completed').length;
    const totalVisits = 4; // This should come from the active package
    return totalVisits - completedVisits;
  };

  const getNextServiceDate = () => {
    const upcomingVisit = serviceVisits.find(v => v.status === 'scheduled');
    return upcomingVisit?.date;
  };

  return {
    packages,
    serviceVisits,
    loading,
    error,
    renewAMC: handleRenewal,
    remainingVisits: getRemainingVisits(),
    nextServiceDate: getNextServiceDate(),
  };
};