// @ai-doc Main router configuration file
// @ai-doc CRITICAL: This file manages the core routing structure
// @ai-doc DO NOT modify the following without careful consideration:
// @ai-doc 1. Provider order and nesting
// @ai-doc 2. Protected route implementation
// @ai-doc 3. Public route implementation
// @ai-doc 4. Route hierarchy

import { 
  Navigate, 
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom';
import { startTransition, Suspense } from 'react';
import App from '@/App';
import { ROUTES } from '@config/routes';
import { ErrorBoundary } from '@components/error-boundary/ErrorBoundary';
import { LoadingScreen } from '@components/LoadingScreen';

// Core Components
import Layout from '@components/Layout';
import Login from '@components/Login';
import NotFound from '@components/NotFound';
import Notifications from '@components/Notifications';
import ProtectedRoute from '@components/ProtectedRoute';
import PublicRoute from '@components/PublicRoute';
import ServiceCategorySelection from '@components/ServiceCategorySelection';
import ServicePricingSelection from '@components/ServicePricingSelection';
import UserProfile from '@components/UserProfile';

// Booking Components
import BookingConfirmation from '@booking/BookingConfirmation';
import FirstTimeBookingFlow from '@booking/FirstTimeBookingFlow';
import PriceSelectionPage from '@booking/PriceSelectionPage';
import ReturnCustomerBooking from '@booking/ReturnCustomerBooking';

// Admin Components
import AdminBookings from '@admin/AdminBookings';
import AdminDashboard from '@admin/AdminDashboard';
import AdminSettings from '@admin/AdminSettings';
import ServiceHub from '@admin/ServiceHub/ServiceHub';
import UserManagement from '@admin/UserManagement';

// Test Components
import SupabaseTest from '@components/test/SupabaseTest';

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Navigate to={ROUTES.HOME} />} />
                <Route path={ROUTES.HOME} element={<ServiceCategorySelection />} />
                <Route path={ROUTES.PRICING} element={<ServicePricingSelection />} />
                <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
                <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />

                {/* Protected Routes */}
                <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path={ROUTES.BOOKING.NEW} element={<ProtectedRoute><FirstTimeBookingFlow /></ProtectedRoute>} />
                <Route path={ROUTES.BOOKING.RETURN} element={<ProtectedRoute><ReturnCustomerBooking /></ProtectedRoute>} />
                <Route path={ROUTES.BOOKING.PRICE} element={<ProtectedRoute><PriceSelectionPage /></ProtectedRoute>} />
                <Route path={ROUTES.BOOKING.CONFIRM} element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path={ROUTES.ADMIN.DASHBOARD} element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.BOOKINGS} element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.USERS} element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.SERVICES} element={<ProtectedRoute adminOnly><ServiceHub /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.SETTINGS} element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />

                {/* Test Routes */}
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/test/supabase" element={<SupabaseTest />} />
                )}

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

RouterComponent.displayName = 'RouterComponent';

export default RouterComponent;
