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
import ServicePricingSelection from './components/ServicePricingSelection';
import ServicePricingSelectionWrapper from './components/ServicePricingSelectionWrapper';
import ReturnCustomerBooking from './components/booking/ReturnCustomerBooking';

const RouterComponent: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <AdminViewProvider>
            <Routes>
              <Route path="/" element={<App />}>
                <Route element={<Layout />}>
                  <Route index element={<ServiceCategorySelection />} />
                  <Route path="returncustomer" element={<ReturnCustomerBooking />} />
                  <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
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
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </AdminViewProvider>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default RouterComponent;
