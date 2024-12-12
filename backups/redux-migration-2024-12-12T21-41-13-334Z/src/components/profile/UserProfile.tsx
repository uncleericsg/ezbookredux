import React, { useState } from 'react';
import { Calendar, CreditCard, User, Edit2, X, Mail, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import AddressManager from './AddressManager';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingButtons from '../FloatingButtons';
import ProfileTabs from './ProfileTabs';
import ProfileStats from './ProfileStats';
import Breadcrumbs from '../common/Breadcrumbs';
import QuickActions from './QuickActions';
import ServiceHistory from './ServiceHistory';

const UserProfile: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const membershipTier = user?.lastName?.toUpperCase().includes('AMC') ? 'AMC' : 'REGULAR';

  // Wait for user data to load and check
  React.useEffect(() => {
    if (!loading && !user) {
      console.log('No user data found, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Return null if no user (will redirect in useEffect)
  if (!user) return null;

  const handleSaveProfile = async (data: any) => {
    try {
      if (userDispatch) {
        userDispatch({ type: 'UPDATE_USER', payload: { ...user, ...data } });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Calculate stats
  const totalBookings = user.bookings?.length || 0;
  const completedServices = user.bookings?.filter(b => b.status === 'Completed').length || 0;
  const memberSince = format(new Date(user.createdAt || new Date()), 'MMMM yyyy');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="space-y-6">
              <ProfileStats
                totalBookings={totalBookings}
                completedServices={completedServices}
                memberSince={user?.createdAt || 'N/A'}
                membershipTier={membershipTier}
                nextServiceDate={user?.nextServiceDate}
                contractExpiryDate={user?.contractExpiryDate}
              />
              
              <QuickActions />
              
              <div className="bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50">
                <ServiceHistory />
              </div>
            </div>
          </>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              {isEditing ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <ProfileForm
                    user={user}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditing(false)}
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Personal Information</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Email</h3>
                      <p className="mt-1 text-white">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Phone</h3>
                      <p className="mt-1 text-white">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Address</h3>
                      <p className="mt-1 text-white">
                        {user.address ? (
                          <>
                            {user.address}
                            {user.unitNumber && ` #${user.unitNumber}`}
                            {user.condoName && `, ${user.condoName}`}
                          </>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    </div>
                    {user.lobbyTower && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Lobby/Tower</h3>
                        <p className="mt-1 text-white">{user.lobbyTower}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Booking History</h2>
            <div className="space-y-6">
              {user.bookings && user.bookings.length > 0 ? (
                user.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-700 rounded-lg p-4 flex flex-col space-y-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => navigate(`/booking/confirmation/${booking.id}`, {
                      state: {
                        bookingReference: booking.id,
                        email: user.email
                      }
                    })}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {booking.serviceType}
                        </h3>
                        <div className="flex items-center text-gray-400 mt-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {format(new Date(booking.date), 'MMMM d, yyyy')}
                            {booking.time && ` at ${booking.time}`}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-400 mt-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{booking.address}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'Upcoming'
                          ? 'bg-blue-500/20 text-blue-400'
                          : booking.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No bookings found
                </div>
              )}
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Manage Addresses</h2>
            <AddressManager />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: 'Profile', path: '/profile' },
              { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }
            ]}
          />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center text-gray-400 mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
