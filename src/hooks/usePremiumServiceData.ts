import { useEffect, useState } from 'react';
import { PremiumService } from '@shared/types/service';

const mockPremiumServices: PremiumService[] = [
  {
    id: 'premium-1',
    name: 'Premium Service 1',
    description: 'Description for premium service 1',
    price: 199.99,
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  },
  // Add more mock services as needed
];

export const usePremiumServiceData = () => {
  const [services, setServices] = useState<PremiumService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPremiumServices = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServices(mockPremiumServices);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch premium services'));
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumServices();
  }, []);

  return { services, loading, error };
};