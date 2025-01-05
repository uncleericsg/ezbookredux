import React, { useEffect, useRef } from 'react';

export const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Handle video loading errors
    const handleError = () => {
      if (videoRef.current) {
        videoRef.current.style.display = 'none';
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('error', handleError);
      return () => video.removeEventListener('error', handleError);
    }
  }, []);

  return (
    <>
      {/* Video Background - Hidden from screen readers and SEO */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/video-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
        width="1920"
        height="1080"
        role="presentation"
      >
        <source 
          src="/videos/bokeh_video_bg.webm" 
          type="video/webm"
        />
        {/* Fallback text for SEO */}
        <p className="hidden">
          iAircon Easy Booking - Singapore's Premier Air Conditioning Service Platform.
          Book your aircon services easily and efficiently.
        </p>
      </video>

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#030812]/90"
        aria-hidden="true"
        role="presentation"
      />
    </>
  );
};

// Add performance optimization styles
const styles = `
  video {
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
`;

// Insert styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default VideoBackground;