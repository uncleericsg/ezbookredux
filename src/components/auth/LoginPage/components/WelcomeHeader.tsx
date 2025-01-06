import React from 'react';

export const WelcomeHeader: React.FC = () => {
  return (
    <div className="text-center mb-6 animate-fade-in">
      {/* Logo with optimized loading */}
      <img
        className="mx-auto h-16 w-16" // Fixed dimensions to prevent layout shift
        src="/logo.png"
        alt="iAircon Easy Booking Logo"
        width={64}
        height={64}
        decoding="async"
        loading="eager"
      />
      {/* Main heading for SEO */}
      <h1 
        id="login-title"
        className="mt-2 text-xl font-bold leading-7 tracking-tight text-[#FFD700]"
      >
        Welcome to iAircon Easy Booking
      </h1>
      {/* Descriptive subheading for SEO */}
      <p className="mt-2 text-sm text-gray-300">
        Singapore's Premier Air Conditioning Service Platform
      </p>
    </div>
  );
};

// Add CSS animation instead of framer-motion
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  will-change: transform;
}
`;

// Insert styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default WelcomeHeader;