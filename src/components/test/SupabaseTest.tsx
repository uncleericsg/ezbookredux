import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/server/config/supabase/client';

interface TestData {
  users?: any[];
  services?: any[];
  bookings?: any[];
  reviews?: any[];
}

const SupabaseTest = () => {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
    data?: TestData;
  }>({
    loading: true
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        
        // Test queries for each table with relationships
        const [
          { data: users, error: usersError },
          { data: services, error: servicesError },
          { data: bookings, error: bookingsError },
          { data: reviews, error: reviewsError }
        ] = await Promise.all([
          supabaseClient.from('users').select('*'),
          supabaseClient.from('services').select('*'),
          supabaseClient.from('bookings').select(`
            *,
            customer:users(email, first_name, last_name),
            service:services(title, price)
          `),
          supabaseClient.from('reviews').select(`
            *,
            customer:users(email),
            booking:bookings(
              scheduled_at,
              service:services(title)
            )
          `)
        ]);

        if (usersError) throw usersError;
        if (servicesError) throw servicesError;
        if (bookingsError) throw bookingsError;
        if (reviewsError) throw reviewsError;

        console.log('Supabase connection successful!');
        
        setStatus({
          loading: false,
          success: true,
          data: {
            users,
            services,
            bookings,
            reviews
          }
        });
      } catch (error) {
        console.error('Connection error:', error);
        setStatus({
          loading: false,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    testConnection();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD'
    }).format(amount / 100);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Database Connection Test</h2>
      
      {status.loading ? (
        <div className="text-blue-500">Testing connection...</div>
      ) : status.success ? (
        <div className="space-y-6">
          <div className="text-green-500 text-lg mb-4">✓ Connection successful!</div>
          
          {/* Users */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Users ({status.data?.users?.length || 0})</h3>
            <div className="grid gap-4">
              {status.data?.users?.map(user => (
                <div key={user.id} className="border border-gray-700 rounded p-3">
                  <div className="font-medium">{user.first_name} {user.last_name}</div>
                  <div className="text-gray-400">{user.email}</div>
                  {user.mobile && <div className="text-gray-400">{user.mobile}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Services ({status.data?.services?.length || 0})</h3>
            <div className="grid gap-4">
              {status.data?.services?.map(service => (
                <div key={service.id} className="border border-gray-700 rounded p-3">
                  <div className="font-medium">{service.title}</div>
                  <div className="text-gray-400">{service.description}</div>
                  <div className="mt-2">
                    <span className="text-green-400">{formatCurrency(service.price)}</span>
                    <span className="text-gray-400 ml-2">• {service.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Bookings ({status.data?.bookings?.length || 0})</h3>
            <div className="grid gap-4">
              {status.data?.bookings?.map(booking => (
                <div key={booking.id} className="border border-gray-700 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{booking.service?.title}</div>
                      <div className="text-gray-400">{booking.customer?.first_name} {booking.customer?.last_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{formatDate(booking.scheduled_at)}</div>
                      <div className="text-xs text-gray-400">{booking.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Reviews ({status.data?.reviews?.length || 0})</h3>
            <div className="grid gap-4">
              {status.data?.reviews?.map(review => (
                <div key={review.id} className="border border-gray-700 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    <div className="text-sm text-gray-400">by {review.customer?.email}</div>
                  </div>
                  {review.comment && <div className="text-gray-300">{review.comment}</div>}
                  <div className="text-sm text-gray-400 mt-2">
                    Service: {review.booking?.service?.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-red-500">
          ✗ Connection failed: {status.error}
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Environment Variables:</h3>
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify({
            DATABASE_URL: '✓ Set',
            DIRECT_URL: '✓ Set',
            SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing',
            SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SupabaseTest;
