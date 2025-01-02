import { useState, useEffect } from 'react';
import { ServiceOption } from '../components/booking/serviceTypes';

const usePremiumServiceData = () => {
  const [premiumServices, setPremiumServices] = useState<ServiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const module = await import('../components/booking/premiumServicesData');
        setPremiumServices(module.premiumServices);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { premiumServices, isLoading, error };
};

export default usePremiumServiceData;