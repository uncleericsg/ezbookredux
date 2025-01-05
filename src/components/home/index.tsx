import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreen } from '@components/LoadingScreen';

// Lazy load sections
const WelcomeSection = lazy(() => import('./sections/WelcomeSection'));
const CategoryGrid = lazy(() => import('./sections/CategoryGrid'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const TrustIndicators = lazy(() => import('@components/TrustIndicators'));

// Types
interface HomePageProps {
  className?: string;
}

/**
 * HomePage Component
 * Main landing page with service categories, testimonials, and trust indicators
 */
const HomePage: React.FC<HomePageProps> = ({ className }) => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Video Background */}
      <Suspense fallback={null}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="videos/bokeh_video_bg.webm" type="video/webm" />
        </video>
      </Suspense>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#030812]/90" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full pt-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <Suspense fallback={<LoadingScreen />}>
          <WelcomeSection />
        </Suspense>

        {/* Service Categories */}
        <Suspense fallback={<LoadingScreen />}>
          <CategoryGrid />
        </Suspense>

        {/* Trust Indicators */}
        <div className="mt-36 mb-24">
          <Suspense fallback={<LoadingScreen />}>
            <TrustIndicators />
          </Suspense>
        </div>

        {/* Testimonials */}
        <Suspense fallback={<LoadingScreen />}>
          <TestimonialsSection />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;