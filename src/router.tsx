// @ai-doc Main router configuration file
// @ai-doc CRITICAL: This file manages the core routing structure
// @ai-doc DO NOT modify the following without careful consideration:
// @ai-doc 1. Provider order and nesting
// @ai-doc 2. Protected route implementation
// @ai-doc 3. Public route implementation
// @ai-doc 4. Route hierarchy

import { startTransition, Suspense, lazy } from 'react';
import { 
  Navigate, 
  Routes,
  Route,
  BrowserRouter
} from 'react-router-dom';

// Core Components - Keep these eager loaded
import Layout from '@components/Layout';
import { LoadingScreen } from '@components/LoadingScreen';
import Login from '@components/Login';
import NotFound from '@components/NotFound';
import ProtectedRoute from '@components/ProtectedRoute';
import PublicRoute from '@components/PublicRoute';
import ServiceCategorySelection from '@components/ServiceCategorySelection';

// Lazy load components that use React Query or are not needed immediately
const Notifications = lazy(() => import('@components/Notifications'));
const UserProfile = lazy(() => import('@components/UserProfile'));
const AdminDashboard = lazy(() => import('@admin/AdminDashboard'));
const AdminSettings = lazy(() => import('@admin/AdminSettings'));
const ServiceHub = lazy(() => import('@admin/ServiceHub/ServiceHub'));
const UserManagement = lazy(() => import('@admin/UserManagement'));
const AMCSignup = lazy(() => import('@components/AMCSignup'));
const PowerJetChemWashHome = lazy(() => import('@booking/PowerJetChemWashHome'));
const BookingConfirmation = lazy(() => import('@booking/BookingConfirmation'));
const FirstTimeBookingFlow = lazy(() => import('@booking/FirstTimeBookingFlow'));
const PriceSelectionPage = lazy(() => import('@booking/PriceSelectionPage'));
const ReturnCustomerBooking = lazy(() => import('@booking/ReturnCustomerBooking'));
const GasCheckLeakage = lazy(() => import('./components/booking/GasCheckLeakage'));
const ServicePricingSelection = lazy(() => import('@components/ServicePricingSelection'));

// Import routes configuration
import { ROUTES } from '@config/routes';

const RouterComponent = () => {
  // Add route logging
  const logRoute = (path: string) => {
    console.log(`[Router] Navigating to: ${path}`);
    return null;
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="*" element={logRoute(window.location.pathname)} />
          <Route element={<Layout />}>
            {/* Core Routes - Eagerly Loaded */}
            <Route index element={<ServiceCategorySelection />} />
            
            {/* Routes with React Query - Lazy Loaded */}
            <Route
              path={ROUTES.NOTIFICATIONS}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <Notifications />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <UserProfile />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            
            {/* Booking Routes - Lazy Loaded */}
            <Route
              path={ROUTES.PRICING}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ServicePricingSelection />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.BOOKING.PRICE_SELECTION}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <PriceSelectionPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.BOOKING.RETURN_CUSTOMER}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <ReturnCustomerBooking />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.BOOKING.FIRST_TIME}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <FirstTimeBookingFlow />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.BOOKING.POWERJET_CHEMICAL}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <PowerJetChemWashHome />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.AMC.SIGNUP}
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <AMCSignup />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.BOOKING.CONFIRMATION}
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <BookingConfirmation />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/gas-check-leak"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <GasCheckLeakage />
                </Suspense>
              }
            />
          </Route>

          {/* Routes WITHOUT Layout */}
          <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />

          {/* Admin Routes - All WITHOUT Layout */}
          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={
              <ProtectedRoute requiresAdmin>
                <Suspense fallback={<LoadingScreen />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.SERVICES}
            element={
              <ProtectedRoute requiresAdmin>
                <Suspense fallback={<LoadingScreen />}>
                  <ServiceHub />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.USERS}
            element={
              <ProtectedRoute requiresAdmin>
                <Suspense fallback={<LoadingScreen />}>
                  <UserManagement />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.SETTINGS}
            element={
              <ProtectedRoute requiresAdmin>
                <Suspense fallback={<LoadingScreen />}>
                  <AdminSettings />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

RouterComponent.displayName = 'RouterComponent';

export default RouterComponent;
