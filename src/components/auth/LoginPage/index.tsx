import React from 'react';
import { getStyle } from './styles/common';
import { FirstTimeCustomerPanel } from './components/FirstTimeCustomerPanel';
import { ExistingCustomerPanel } from './components/ExistingCustomerPanel';
import { VideoBackground } from './components/VideoBackground';
import { WelcomeHeader } from './components/WelcomeHeader';

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
  return (
    <div className={getStyle('containers', 'root')}>
      {/* Background */}
      <VideoBackground />

      {/* Content Container */}
      <div className={getStyle('containers', 'content')}>
        {/* Logo and Welcome Text */}
        <WelcomeHeader />

        {/* Login Panels */}
        <div className={getStyle('responsive', 'container')}>
          <div className={getStyle('containers', 'grid')}>
            <FirstTimeCustomerPanel />
            <ExistingCustomerPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;