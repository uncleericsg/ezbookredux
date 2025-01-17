// @ai-doc Main router configuration file
// @ai-doc CRITICAL: This file manages the core routing structure
// @ai-doc DO NOT modify the following without careful consideration:
// @ai-doc 1. Provider order and nesting
// @ai-doc 2. Protected route implementation
// @ai-doc 3. Public route implementation
// @ai-doc 4. Route hierarchy

import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';

// Lazy load components
const Layout = React.lazy(() => import('@/components/Layout'));
const HomePage = React.lazy(() => import('@/components/home'));
const Notifications = React.lazy(() => import('@/components/Notifications'));
const UserProfile = React.lazy(() => import('@/components/UserProfile'));
const BookingConfirmation = React.lazy(() => import('@/components/booking/BookingConfirmation'));
const ReturnCustomerBooking = React.lazy(() => import('@/components/booking/ReturnCustomerBooking'));
const FirstTimeBookingFlowWrapper = React.lazy(() => import('@/components/booking/FirstTimeBookingFlow'));
const AdminDashboard = React.lazy(() => import('@/components/admin/AdminDashboard'));
const ServiceHub = React.lazy(() => import('@/components/admin/ServiceHub/ServiceHub'));
const UserManagement = React.lazy(() => import('@/components/admin/UserManagement'));
const Settings = React.lazy(() => import('@/components/admin/SettingsPage'));
const Login = React.lazy(() => import('@/components/auth/LoginPage'));
const NotFound = React.lazy(() => import('@/components/NotFound'));

export const RouterComponent = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingScreen />}>
            <Layout />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="notifications"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Notifications />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <UserProfile />
            </Suspense>
          }
        />
        <Route
          path="booking"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <BookingConfirmation />
            </Suspense>
          }
        />
        <Route
          path="return-customer-booking"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ReturnCustomerBooking />
            </Suspense>
          }
        />
        <Route
          path="first-time-booking"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <FirstTimeBookingFlowWrapper />
            </Suspense>
          }
        />
        <Route
          path="admin"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminDashboard />
            </Suspense>
          }
        >
          <Route
            path="service-hub"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <ServiceHub />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <UserManagement />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="login"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
