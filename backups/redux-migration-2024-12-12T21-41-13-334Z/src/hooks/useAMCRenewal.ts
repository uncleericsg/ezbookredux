import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { renewAMC } from '../services/amc';
import type { AMCPackage } from '../types';

export const useAMCRenewal = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<AMCPackage | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePackageSelect = (pkg: AMCPackage) => {
    setSelectedPackage(pkg);
  };

  const handleRenewal = async () => {
    if (!selectedPackage) {
      toast.showError('Please select a package');
      return;
    }

    try {
      setLoading(true);
      await renewAMC(selectedPackage.id);
      toast.showSuccess('AMC package renewed successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.showError('Failed to renew AMC package');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    selectedPackage,
    handlePackageSelect,
    handleRenewal,
  };
};