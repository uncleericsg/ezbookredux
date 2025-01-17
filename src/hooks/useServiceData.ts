import { useEffect, useState } from 'react';
import { Service } from '@shared/types/service';

const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Regular Service 1',
    description: 'Description for regular service 1',
    price: 99.99,
    duration: 60
  },
  // Add more mock services as needed
];

export const useServiceData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServices(mockServices);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch services'));
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};