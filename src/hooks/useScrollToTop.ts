import { useEffect } from 'react';

/**
 * Hook to scroll to top of page on mount
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
