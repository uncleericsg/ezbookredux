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
 * Main login page component
 * Combines:
 * - Video background with gradient overlay
 * - Welcome header with logo
 * - First time customer panel
 * - Existing customer panel
 * 
 * Layout:
 * - Full screen background video
 * - Centered content
 * - Grid layout for panels (60/40 split)
 */
const LoginPage: React.FC = () => {
  const { loading: authLoading } = useAppSelector(state => state.auth);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <VideoBackground />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full pt-6 px-4 sm:px-6 lg:px-8">
        {/* Logo and Welcome Text */}
        <WelcomeHeader />

        {/* Login Panels */}
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 divide-gray-700">
            <FirstTimeCustomerPanel />
            <ExistingCustomerPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;