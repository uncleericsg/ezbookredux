import React from 'react';

export const VideoBackground: React.FC = () => {
  return (
    <>
      {/* Video Background - Hidden from screen readers and SEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
        preload="auto"
        poster="/videos/bokeh_video_bg.webm?poster"
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
      />
    </>
  );
};

export default VideoBackground;