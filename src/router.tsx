// @ai-doc Main router configuration file
// @ai-doc CRITICAL: This file manages the core routing structure
// @ai-doc DO NOT modify the following without careful consideration:
// @ai-doc 1. Provider order and nesting
// @ai-doc 2. Protected route implementation
// @ai-doc 3. Public route implementation
// @ai-doc 4. Route hierarchy

import { startTransition, Suspense } from 'react';
import { 
  Navigate, 
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom';


import AdminBookings from '@admin/AdminBookings';
import AdminDashboard from '@admin/AdminDashboard';
import AdminSettings from '@admin/AdminSettings';
import ServiceHub from '@admin/ServiceHub/ServiceHub';
import UserManagement from '@admin/UserManagement';

import AMCSignup from '@components/AMCSignup';
import PowerJetChemWashHome from '@booking/PowerJetChemWashHome';
import { ErrorBoundary } from '@components/error-boundary/ErrorBoundary';
import Layout from '@components/Layout';
import { LoadingScreen } from '@components/LoadingScreen';

// Core Components
import Login from '@components/Login';
import NotFound from '@components/NotFound';
import Notifications from '@components/Notifications';
import ProtectedRoute from '@components/ProtectedRoute';
import PublicRoute from '@components/PublicRoute';
import ServiceCategorySelection from '@components/ServiceCategorySelection';
import ServicePricingSelection from '@components/ServicePricingSelection';
import SupabaseTest from '@components/test/SupabaseTest';
import UserProfile from '@components/UserProfile';

// Booking Components
import BookingConfirmation from '@booking/BookingConfirmation';
import FirstTimeBookingFlow from '@booking/FirstTimeBookingFlow';
import PriceSelectionPage from '@booking/PriceSelectionPage';
import ReturnCustomerBooking from '@booking/ReturnCustomerBooking';

// Admin Components


// Test Components
import { ROUTES } from '@config/routes';

import App from './App';
// import PriceCardsMockup from './components/mockups/PriceCards';
// import MockHome from './components/mockups/MockHome';
import GasCheckLeakage from './components/booking/GasCheckLeakage';


const RouterComponent = () => {
  // Add route logging
  const logRoute = (path: string) => {
    console.log(`[Router] Navigating to: ${path}`);
    return null;
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="*" element={logRoute(window.location.pathname)} />
            {/* Routes WITH Layout */}
            <Route element={<Layout />}>
              <Route index element={<ServiceCategorySelection />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
              <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Route>

            {/* Routes WITHOUT Layout */}
            <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
            <Route path={ROUTES.PRICING} element={<ServicePricingSelection />} />
            <Route path={ROUTES.BOOKING.PRICE_SELECTION} element={<PriceSelectionPage />} />
            <Route path={ROUTES.BOOKING.RETURN_CUSTOMER} element={<ReturnCustomerBooking />} />
            <Route path={ROUTES.BOOKING.FIRST_TIME} element={<FirstTimeBookingFlow />} />
            <Route
              path={ROUTES.BOOKING.POWERJET_CHEMICAL}
              element={<PowerJetChemWashHome />}
            />
            <Route path={ROUTES.AMC.SIGNUP} element={<AMCSignup />} />
            <Route path={ROUTES.BOOKING.CONFIRMATION} element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
            <Route path="/booking/gas-check-leak" element={<PublicRoute><GasCheckLeakage /></PublicRoute>} />

            {/* Admin Routes - All WITHOUT Layout */}
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<ProtectedRoute requiresAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN.SERVICES} element={<ProtectedRoute requiresAdmin><ServiceHub /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN.USERS} element={<ProtectedRoute requiresAdmin><UserManagement /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN.SETTINGS} element={<ProtectedRoute requiresAdmin><AdminSettings /></ProtectedRoute>} />

            {/* Test Routes */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <Route path="/test/supabase" element={<SupabaseTest />} />
              </>
            )}

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

RouterComponent.displayName = 'RouterComponent';

export default RouterComponent;
