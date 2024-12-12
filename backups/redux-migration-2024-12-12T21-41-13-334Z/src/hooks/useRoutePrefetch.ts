import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Define the booking flow steps and their dependencies
const BOOKING_FLOW_ROUTES = {
  '/booking': ['/schedule', '/dashboard'],
  '/schedule': ['/amc/signup', '/payment'],
  '/amc/signup': ['/amc/subscribe'],
} as const;

export const useRoutePrefetch = () => {
  const location = useLocation();
  
  useEffect(() => {
    const currentPath = location.pathname;
    const routesToPrefetch = BOOKING_FLOW_ROUTES[currentPath as keyof typeof BOOKING_FLOW_ROUTES];

    if (!routesToPrefetch) return;

    // Prefetch the next possible routes
    routesToPrefetch.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
    });

    // Cleanup prefetch links when component unmounts
    return () => {
      routesToPrefetch.forEach(route => {
        const link = document.querySelector(`link[href="${route}"]`);
        if (link) {
          document.head.removeChild(link);
        }
      });
    };
  }, [location.pathname]);
};
