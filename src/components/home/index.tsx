import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreen } from '@components/LoadingScreen';
import SectionErrorBoundary from './utils/ErrorBoundary';
import { initializeTracking } from './utils/performance';

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
  // Initialize performance tracking
  useEffect(() => {
    const cleanup = initializeTracking();
    return () => cleanup();
  }, []);

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
        <SectionErrorBoundary section="welcome">
          <Suspense fallback={<LoadingScreen />}>
            <WelcomeSection />
          </Suspense>
        </SectionErrorBoundary>

        {/* Service Categories */}
        <SectionErrorBoundary section="categories">
          <Suspense fallback={<LoadingScreen />}>
            <CategoryGrid />
          </Suspense>
        </SectionErrorBoundary>

        {/* Trust Indicators */}
        <div className="mt-36 mb-24">
          <SectionErrorBoundary section="trust-indicators">
            <Suspense fallback={<LoadingScreen />}>
              <TrustIndicators />
            </Suspense>
          </SectionErrorBoundary>
        </div>

        {/* Testimonials */}
        <SectionErrorBoundary section="testimonials">
          <Suspense fallback={<LoadingScreen />}>
            <TestimonialsSection />
          </Suspense>
        </SectionErrorBoundary>
      </div>
    </div>
  );
};

export default HomePage;