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
import App from './App';
import Layout from './components/Layout';
import ServiceCategorySelection from './components/ServiceCategorySelection';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Notifications from './components/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from './components/NotFound';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { AdminViewProvider } from './contexts/AdminViewContext';
import PriceSelectionPage from './components/booking/PriceSelectionPage';
import FirstTimeBookingFlow from './components/booking/FirstTimeBookingFlow';
import ReturnCustomerBooking from './components/booking/ReturnCustomerBooking';
import ServicePricingSelection from './components/ServicePricingSelection';
import BookingConfirmation from './components/booking/BookingConfirmation';
import { ROUTES } from './config/routes';
import SupabaseTest from './components/test/SupabaseTest';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSettings from './components/admin/AdminSettings';
import UserManagement from './components/admin/UserManagement';
import AdminBookings from './components/admin/AdminBookings';
import ServiceHub from './components/admin/ServiceHub/ServiceHub';

const RouterComponent: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <AdminViewProvider>
            <Routes>
              <Route path="/" element={<App />}>
                {/* Routes with Layout (Navbar & Footer) */}
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route index element={<ServiceCategorySelection />} />
                  <Route path="pricing" element={<ServicePricingSelection />} />
                  <Route path="test/supabase" element={<SupabaseTest />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute requiresAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to={ROUTES.ADMIN.SERVICES} replace />} />
                    <Route path="services" element={<ServiceHub />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                {/* Routes without Layout (No Navbar & Footer) */}
                <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
                
                {/* Booking Flow Routes - No Layout */}
                <Route path="booking">
                  <Route path="price-selection" element={<PriceSelectionPage />} />
                  <Route path="first-time/*" element={<FirstTimeBookingFlow />} />
                  <Route path="return-customer" element={<ReturnCustomerBooking />} />
                  <Route path="confirmation/:bookingId" element={<BookingConfirmation />} />
                </Route>

                {/* 404 Page - No Layout */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AdminViewProvider>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default RouterComponent;
