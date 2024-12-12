import { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/admin';

interface AnalyticsData {
  bookings: Array<{
    month: string;
    count: number;
  }>;
  satisfaction: Array<{
    rating: number;
    count: number;
  }>;
  metrics?: {
    activeAMCs: number;
    completedServices: number;
    averageRating: number;
  };
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    bookings: [],
    satisfaction: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analyticsData = await fetchAnalytics();
        setData(analyticsData);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    // Refresh analytics every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};