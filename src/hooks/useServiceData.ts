import { useState, useEffect } from 'react';
import { ServiceOption } from '../components/booking/serviceTypes';

const useServiceData = () => {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const module = await import('../components/booking/servicesData');
        setServices(module.serviceOptions);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { services, isLoading, error };
};

export default useServiceData;