import { useEffect } from 'react';

export const usePreloadComponents = () => {
  useEffect(() => {
    // Preload components in the background
    const preloadComponents = async () => {
      const components = [
        import('@components/booking/IssueSelection'),
        import('@components/booking/CustomerForm'),
      ];
      
      try {
        await Promise.all(components);
      } catch (error) {
        console.error('Error preloading components:', error);
      }
    };

    // Start preloading after initial render
    const timeoutId = setTimeout(preloadComponents, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
};
