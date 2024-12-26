import { useState, useEffect } from 'react';
import { fetchServiceCategories } from '@services/acuity';
import { useToast } from '@hooks/useToast';
import type { ServiceCategory } from '@types';

export const useServiceCategories = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchServiceCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load service categories:', err);
        setError('Failed to load service categories');
        toast.showError('Failed to load service categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filterCategoriesByAMC = (isAmcCustomer: boolean) => {
    return categories.filter(category => {
      if (isAmcCustomer) {
        // Show all categories for AMC customers
        return true;
      }
      // Hide AMC-specific categories for non-AMC customers
      return category.type !== 'amc';
    });
  };

  return { categories, loading, error, filterCategoriesByAMC };
};