import React, { useCallback } from 'react';
import { useVideoBackground } from './useVideoBackground';
import { getStyle, cn } from '../../styles/common';
import { ASSETS } from '../../constants';
import type { VideoBackgroundProps } from '../../types';

/**
 * Video background component with loading and error states
 */
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  onLoadedData,
  onError
}) => {
  const {
    videoLoaded,
    videoError,
    handleLoadedData,
    handleError
  } = useVideoBackground();

  // Combined handlers to notify parent component
  const handleVideoLoaded = useCallback(() => {
    handleLoadedData();
    onLoadedData?.();
  }, [handleLoadedData, onLoadedData]);

  const handleVideoError = useCallback((error: any) => {
    handleError(error);
    onError?.(error);
  }, [handleError, onError]);

  return (
    <>
      {/* Loading State */}
      {!videoLoaded && !videoError && (
        <div className={getStyle('backgrounds', 'loading')} />
      )}

      {/* Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        className={cn(
          getStyle('backgrounds', 'video'),
          videoLoaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500'
        )}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
      >
        <source src={ASSETS.VIDEO_BG} type="video/webm" />
      </video>

      {/* Gradient Overlay */}
      <div className={getStyle('backgrounds', 'gradient')} />

      {/* Error Fallback */}
      {videoError && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
      )}
    </>
  );
};

export default VideoBackground;