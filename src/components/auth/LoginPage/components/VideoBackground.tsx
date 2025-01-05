import React from 'react';

/**
 * Video Background Component
 * 
 * TODO: Create and add poster image
 * - Required dimensions: 1920x1080
 * - Should capture bokeh effect with gradient overlay
 * - Save as: /public/images/video-poster.jpg
 * - Format: JPG (best for photographs)
 * - Quality: 80-90% (balance between quality and file size)
 */
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
        // Add poster attribute once image is created:
        // poster="/images/video-poster.jpg"
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