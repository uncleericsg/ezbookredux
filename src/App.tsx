import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { UserProvider } from './contexts/UserContext';
import BasicUserProvider from './contexts/BasicUserContext';
import { CombinedUserProvider } from './contexts/CombinedUserContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { useServiceManager } from './hooks/useServiceManager';
import { LoadingScreen } from './components/LoadingScreen';
import TestAuth from './components/auth/TestAuth';
import Login from './components/Login';
import Layout from './components/Layout';
import ServiceCategorySelection from './components/ServiceCategorySelection';
import FirstTimeBookingFlow from './components/booking/FirstTimeBookingFlow';
import PriceSelectionPage from './components/booking/PriceSelectionPage';
import ReturnCustomerBooking from './components/booking/ReturnCustomerBooking';
import ReturnCustomerPricingPage from './components/booking/ReturnCustomerPricingPage';
import AMCPackages from './components/AMCSignup';
import AdminDashboard from './components/admin/AdminDashboard';
import FloatingButtons from './components/FloatingButtons';
import PaymentSuccess from './components/payment/PaymentSuccess';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { isInitializing, error } = useServiceManager({
    services: ['auth', 'firestore'],
    retryAttempts: 3,
    retryDelay: 1000,
  });

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            {error.message || 'An error occurred while initializing the app'}
          </p>
        </div>
      </div>
    );  
  }

  return (
    <BasicUserProvider>
      <CombinedUserProvider>
        <UserProvider>
          <PaymentProvider>
            <div className="App min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
              {/* Content */}
              <div className="relative">
                <ScrollToTop />
                <Toaster position="top-center" />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/test-auth" element={<TestAuth />} />
                  <Route path="/booking/first-time/*" element={<FirstTimeBookingFlow />} />
                  <Route path="/booking/price-selection" element={<PriceSelectionPage />} />
                  <Route path="/booking/return-customer" element={<ReturnCustomerPricingPage />} />
                  <Route path="/booking/return-customer/details" element={<ReturnCustomerBooking />} />
                  <Route path="/amc/packages" element={<AMCPackages />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  
                  {/* Admin Route */}
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  
                  {/* Main Layout Routes */}
                  <Route element={<Layout />}>
                    <Route path="/" element={
                      <>
                        <ServiceCategorySelection />
                        <FloatingButtons />
                      </>
                    } />
                  </Route>
                </Routes>
              </div>
            </div>
          </PaymentProvider>
        </UserProvider>
      </CombinedUserProvider>
    </BasicUserProvider>
  );
}

export default App;