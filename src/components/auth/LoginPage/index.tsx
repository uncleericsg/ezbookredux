import React from 'react';
import { useAppSelector } from '../../../store';
import { LoadingScreen } from '@components/LoadingScreen';
import {
  VideoBackground,
  WelcomeHeader,
  FirstTimeCustomerPanel,
  ExistingCustomerPanel
} from './components';

/**
 * Main login page component with SEO and accessibility enhancements
 * - Semantic HTML structure
 * - Proper heading hierarchy
 * - ARIA labels
 * - Clear content sections
 */
const LoginPage: React.FC = () => {
  const { loading: authLoading } = useAppSelector(state => state.auth);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <main 
      className="min-h-screen w-full relative"
      role="main"
      aria-labelledby="login-title"
    >
      {/* Background - Hidden from screen readers */}
      <div aria-hidden="true">
        <VideoBackground />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full pt-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header role="banner">
          <WelcomeHeader />
        </header>

        {/* Login Panels Container */}
        <div className="max-w-6xl w-full">
          <div 
            className="grid grid-cols-1 md:grid-cols-5 gap-6 divide-gray-700"
            role="region"
            aria-label="Login Options"
          >
            {/* First Time Customer Section */}
            <section 
              aria-labelledby="new-customer-title"
              className="md:col-span-3"
            >
              <FirstTimeCustomerPanel />
            </section>

            {/* Existing Customer Section */}
            <section 
              aria-labelledby="returning-customer-title"
              className="md:col-span-2"
            >
              <ExistingCustomerPanel />
            </section>
          </div>
        </div>
      </div>

      {/* SEO: Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "iAircon Easy Booking Login",
          "description": "Access Singapore's premier air conditioning service platform",
          "provider": {
            "@type": "LocalBusiness",
            "name": "iAircon Services",
            "areaServed": "Singapore"
          }
        })}
      </script>
    </main>
  );
};

export default LoginPage;