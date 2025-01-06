import React, { lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingScreen } from '@components/LoadingScreen.js';
import { ErrorBoundary, SectionErrorFallback } from '@components/error-boundary';
import { initializeTracking } from './utils/performance';
import styles from './styles/Home.module.css';

// Lazy load sections
const WelcomeSection = lazy(() => import('./sections/WelcomeSection.js'));
const CategoryGrid = lazy(() => import('./sections/CategoryGrid.js'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection.js'));
const TrustIndicators = lazy(() => import('@components/TrustIndicators.js'));
const FloatingButtons = lazy(() => import('@components/FloatingButtons.js'));

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
    <div className={styles.container}>
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Categories Design */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Welcome Section */}
          <ErrorBoundary
            fallback={(error) => (
              <SectionErrorFallback
                error={error}
                section="welcome"
                resetErrorBoundary={() => {}}
              />
            )}
          >
            <Suspense fallback={<LoadingScreen />}>
              <WelcomeSection />
            </Suspense>
          </ErrorBoundary>

          {/* Service Categories */}
          <ErrorBoundary
            fallback={(error) => (
              <SectionErrorFallback
                error={error}
                section="categories"
                resetErrorBoundary={() => {}}
              />
            )}
          >
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
          </ErrorBoundary>
        </motion.div>

        {/* Trust Indicators */}
        <div className="mt-36 mb-24">
          <ErrorBoundary
            fallback={(error) => (
              <SectionErrorFallback
                error={error}
                section="trust-indicators"
                resetErrorBoundary={() => {}}
              />
            )}
          >
            <Suspense fallback={<LoadingScreen />}>
              <TrustIndicators />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Testimonials */}
        <ErrorBoundary
          fallback={(error) => (
            <SectionErrorFallback
              error={error}
              section="testimonials"
              resetErrorBoundary={() => {}}
            />
          )}
        >
          <Suspense fallback={<LoadingScreen />}>
            <TestimonialsSection />
          </Suspense>
        </ErrorBoundary>

        {/* Floating Buttons */}
        <ErrorBoundary
          fallback={(error) => (
            <SectionErrorFallback
              error={error}
              section="floating-buttons"
              resetErrorBoundary={() => {}}
            />
          )}
        >
          <Suspense fallback={null}>
            <FloatingButtons />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default HomePage;