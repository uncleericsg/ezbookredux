import { useEffect, useCallback } from 'react';

export const useScrollToTop = (dependencies: any[] = []) => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    scrollToTop();
  }, dependencies);

  return scrollToTop;
};
