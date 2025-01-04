import { useState, useCallback } from 'react';
import type { UseVideoBackgroundReturn } from '../../types';

/**
 * Hook to manage video background state and handlers
 */
export const useVideoBackground = (): UseVideoBackgroundReturn => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleLoadedData = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('Video failed to load:', error);
    setVideoError(true);
    setVideoLoaded(false);
  }, []);

  return {
    videoLoaded,
    videoError,
    handleLoadedData,
    handleError
  };
};