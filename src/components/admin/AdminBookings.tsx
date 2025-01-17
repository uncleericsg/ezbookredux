import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import AdminHeader from '@admin/AdminHeader';
import AdminNav from '@admin/AdminNav';
import { useBooking } from '@/hooks/useBooking';
import type { BookingDetails } from '@server/types/booking';
import { useAuth } from '@/hooks/useAuth';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const { loading, error, fetchBookingsByEmail } = useBooking();
  const { user } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.email) return;

      try {
        const result = await fetchBookingsByEmail(user.email);
        if (result.data) {
          setBookings(result.data);
        } else if (result.error) {
          toast.error('Failed to load bookings');
        }
      } catch (err) {
        toast.error('Error loading bookings');
      }
    };

    loadBookings();
  }, [user?.email, fetchBookingsByEmail]);

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title="Bookings Management" />
      <AdminNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">All Bookings</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-8">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400">No bookings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {`${booking.customer_info.first_name} ${booking.customer_info.last_name}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.service_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {format(new Date(booking.scheduled_datetime), 'PPP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          booking.status === 'completed' 
                            ? 'bg-green-900 text-green-200'
                            : booking.status === 'pending'
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

AdminBookings.displayName = 'AdminBookings';

export { AdminBookings };
export default AdminBookings;
