// @ai-doc Main router configuration file
// @ai-doc CRITICAL: This file manages the core routing structure
// @ai-doc DO NOT modify the following without careful consideration:
// @ai-doc 1. Provider order and nesting
// @ai-doc 2. Protected route implementation
// @ai-doc 3. Public route implementation
// @ai-doc 4. Route hierarchy

import { 
  createBrowserRouter, 
  Navigate, 
  RouterProvider,
  type RouterProviderProps,
  type RouteObject
} from 'react-router-dom';
import { startTransition, Suspense, lazy } from 'react';
import App from './App';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ServiceCategorySelection from './components/ServiceCategorySelection';
import ServiceScheduling from './components/ServiceScheduling';
import AMCManagement from './components/AMCManagement';
import AMCSignup from './components/AMCSignup';
import AMCSubscriptionFlow from './components/AMCSubscriptionFlow';
import UserProfile from './components/UserProfile';
import NotificationList from './components/NotificationList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import TechDashboard from './components/tech/TechDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminViewProvider } from './contexts/AdminViewContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import BookingFlow from './components/booking/BookingFlow';
import FirstTimeBookingFlow from './components/booking/FirstTimeBookingFlow';
import PriceSelectionPage from './components/booking/PriceSelectionPage';
import NotFound from './components/NotFound';

// @ai-doc Lazy loaded components for code splitting
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminViewProvider>
          <UserProvider>
            <PaymentProvider>
              {children}
            </PaymentProvider>
          </UserProvider>
        </AdminViewProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

const routerConfig = {
  future: {
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
  },
};

// @ai-doc Router configuration
const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <UserProvider>
        <AppProviders>
          <App />
        </AppProviders>
      </UserProvider>
    ),
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <ServiceCategorySelection />,
            handle: {
              crumb: () => 'Home'
            }
          },
          {
            path: 'login',
            element: <PublicRoute><Login /></PublicRoute>,
            handle: {
              crumb: () => 'Login'
            }
          },
          {
            path: 'booking',
            children: [
              {
                path: 'prices',
                element: <PriceSelectionPage />,
                handle: {
                  crumb: () => 'Price Selection'
                }
              },
              {
                path: 'firsttime',
                element: <FirstTimeBookingFlow />,
                handle: {
                  crumb: () => 'First Time Booking'
                }
              }
            ]
          },
          {
            path: 'amc',
            children: [
              {
                path: 'packages',
                element: <AMCSignup />,
                handle: {
                  crumb: () => 'AMC Packages'
                }
              },
              {
                path: 'subscription-flow',
                element: <ProtectedRoute><AMCSubscriptionFlow /></ProtectedRoute>,
                handle: {
                  crumb: () => 'AMC Subscription',
                  requiresAuth: true
                }
              }
            ]
          },
          {
            path: 'dashboard',
            element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
            handle: {
              crumb: () => 'Dashboard',
              requiresAuth: true
            }
          },
          {
            path: 'schedule',
            element: <ProtectedRoute><ServiceScheduling /></ProtectedRoute>,
            handle: {
              crumb: () => 'Schedule Service',
              requiresAuth: true
            }
          },
          {
            path: 'notifications',
            element: <ProtectedRoute><NotificationList /></ProtectedRoute>,
            handle: {
              crumb: () => 'Notifications',
              requiresAuth: true
            }
          },
          {
            path: 'profile',
            element: <ProtectedRoute><UserProfile /></ProtectedRoute>,
            handle: {
              crumb: () => 'Profile',
              requiresAuth: true
            }
          },
          {
            path: 'admin/*',
            element: <ProtectedRoute requiresAdmin><AdminDashboard /></ProtectedRoute>,
            handle: {
              crumb: () => 'Admin',
              requiresAuth: true,
              requiresAdmin: true
            }
          },
          {
            path: 'tech/*',
            element: <ProtectedRoute requiresTech><TechDashboard /></ProtectedRoute>,
            handle: {
              crumb: () => 'Tech',
              requiresAuth: true,
              requiresTech: true
            }
          },
          {
            path: '*',
            element: <NotFound />
          }
        ]
      }
    ]
  }
];

// @ai-doc Main router component
const RouterComponent = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider 
        router={createBrowserRouter(routes, routerConfig)} 
        fallbackElement={<LoadingScreen />}
        future={routerConfig.future}
      />
    </Suspense>
  );
};

export default RouterComponent;
