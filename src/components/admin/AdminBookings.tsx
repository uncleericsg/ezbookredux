import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';
import { useBooking } from '@hooks/useBooking';
import { useAuth } from '@hooks/useAuth';

import type { Booking, BookingStatus } from '@shared/types/booking';
import type {
  UseBookingResult,
  UseAuthResult
} from '@shared/types';
import type { AdminHeaderProps } from '@shared/types/admin';
import type { AdminSettings } from '@shared/types/settings';

import { defaultSettings } from '@shared/types/settings';
import { isAdminSettings } from '@utils/typeGuards';

const AdminBookings: FC = (): JSX.Element => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { loading: bookingLoading, error, fetchBookingsByEmail } = useBooking() as UseBookingResult;
  const { user } = useAuth() as UseAuthResult;
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);

  const loading = bookingLoading;

  // Validate settings on mount
  useEffect(() => {
    if (!isAdminSettings(defaultSettings)) {
      console.error('Invalid admin settings');
      return;
    }
  }, []);

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
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading bookings';
        toast.error(errorMessage);
      }
    };

    loadBookings();
  }, [user?.email, fetchBookingsByEmail]);

  const renderBookingStatus = (status: BookingStatus): JSX.Element => {
    const statusClasses: Record<BookingStatus, string> = {
      completed: 'bg-green-900 text-green-200',
      pending: 'bg-yellow-900 text-yellow-200',
      cancelled: 'bg-red-900 text-red-200',
      confirmed: 'bg-blue-900 text-blue-200',
      rescheduled: 'bg-purple-900 text-purple-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const handleUpdateSettings = async (updates: Partial<AdminSettings>) => {
    try {
      setSettings((prev: AdminSettings) => ({ ...prev, ...updates }));
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const headerProps: AdminHeaderProps = {
    settings,
    loading,
    integrationStatus: {},
    onIntervalChange: () => {},
    updateSettings: handleUpdateSettings
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader {...headerProps} />
      <AdminNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
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
                        {booking.customerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.serviceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {format(new Date(booking.date), 'PPP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderBookingStatus(booking.status)}
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
