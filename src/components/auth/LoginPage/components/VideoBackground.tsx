import React from 'react';

export const VideoBackground: React.FC = () => {
  return (
    <>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="videos/bokeh_video_bg.webm" type="video/webm" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#030812]/90" />
    </>
  );
};

export default VideoBackground;