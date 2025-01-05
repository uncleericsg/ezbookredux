import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreen } from '@components/LoadingScreen.js';
import SectionErrorBoundary from './utils/ErrorBoundary';
import { initializeTracking } from './utils/performance';
import '@styles/home.css';

// Lazy load sections
const WelcomeSection = lazy(() => import('./sections/WelcomeSection.js'));
const CategoryGrid = lazy(() => import('./sections/CategoryGrid.js'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection.js'));
const TrustIndicators = lazy(() => import('@components/TrustIndicators.js'));

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
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Background Gradient */}
      <div className="bg-gradient-overlay" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <SectionErrorBoundary section="welcome">
          <Suspense fallback={<LoadingScreen />}>
            <WelcomeSection />
          </Suspense>
        </SectionErrorBoundary>

        {/* Service Categories */}
        <SectionErrorBoundary section="categories">
          <Suspense fallback={
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-pulse bg-gray-800 rounded-lg p-8">
                  <div className="h-8 w-32 bg-gray-700 rounded mb-4 mx-auto"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          }>
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