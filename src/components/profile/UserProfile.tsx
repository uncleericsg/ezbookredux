import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CreditCard,
  User as UserIcon,
  Edit,
  X,
  AtSign as EmailIcon,
  Phone as ContactIcon,
  Home as AddressIcon
} from 'lucide-react';

const renderTabContent = () => {
  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          <ProfileStats
            totalBookings={user?.bookings?.length || 0}
            completedServices={user?.bookings?.filter(b => b.status === 'completed').length || 0}
            memberSince={formatDate(user?.createdAt)}
            membershipTier={membershipTier}
            nextServiceDate={user?.nextServiceDate}
            contractExpiryDate={user?.contractExpiryDate}
          />
          <QuickActions />
          <div className="bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50">
            <ServiceHistory />
          </div>
        </div>
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
                    <Edit className="w-5 h-5 text-gray-400" />
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
import type { ProfileTabsProps } from '@/types/profile-tabs';
import { format, isValid } from 'date-fns';
import { useUserRedux } from '@/hooks/useUserRedux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type {
  ProfileTab,
  ProfileUpdateData,
  MembershipTier,
  ServiceHistoryItem
} from '@/types/profile';
import ProfileForm from './ProfileForm';
import AddressManager from './AddressManager';
import FloatingButtons from '@/components/common/FloatingButtons';
import ProfileTabs from './ProfileTabs';
import ProfileStats from './ProfileStats';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import QuickActions from './QuickActions';
import ServiceHistory from './ServiceHistory';

const formatDate = (dateStr?: string | Date): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return isValid(date) ? format(date, 'MMMM yyyy') : 'Invalid date';
};

const UserProfile: React.FC = () => {
  const { user, loading, updateProfile } = useUserRedux();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const membershipTier: MembershipTier = user?.lastName?.toUpperCase().includes('AMC') ? 'AMC' : 'REGULAR';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSaveProfile = async (data: ProfileUpdateData) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile Update Error:', error);
      toast.error('Failed to update profile');
    }
  };

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

  if (!user) {
    return null;
  }

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
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
              <UserIcon className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center text-gray-400 mt-1">
                <EmailIcon className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center text-gray-400 mt-1">
                  <ContactIcon className="w-4 h-4 mr-2" />
                  {user.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <ProfileTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </div>

        <AnimatePresence>
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
