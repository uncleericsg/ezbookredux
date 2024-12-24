import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, LogOut, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { clearAuth } from '../store/slices/authSlice';
import { resetUser } from '../store/slices/userSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServiceHistory from './ServiceHistory';
import AddressManager from './profile/AddressManager';
import ProfileForm from './profile/ProfileForm';
import { LoadingScreen } from './LoadingScreen';

const UserProfile: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Show loading screen while auth is being initialized
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if no user
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    try {
      dispatch(clearAuth());
      dispatch(resetUser());
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              {currentUser.amcStatus === 'active' && (
                <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-400">
                  AMC Active
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-icon text-gray-400 hover:text-gray-300"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {isEditing ? (
          <ProfileForm user={currentUser} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6 max-w-3xl">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium mt-1">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Mobile Number</p>
                  <p className="font-medium mt-1">{currentUser.phone}</p>
                  <span className="text-xs text-gray-500">(This is your password)</span>
                </div>
              </div>
              
              {(currentUser.unitNumber || currentUser.address || currentUser.condoName || currentUser.lobbyTower) && (
                <div className="flex items-start space-x-3 col-span-1 sm:col-span-2">
                  <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <div className="mt-1 space-y-1 break-words">
                      {currentUser.unitNumber && <p className="font-medium">{currentUser.unitNumber}</p>}
                      {currentUser.address && <p className="font-medium">{currentUser.address}</p>}
                      {currentUser.condoName && <p className="font-medium">{currentUser.condoName}</p>}
                      {currentUser.lobbyTower && <p className="font-medium">{currentUser.lobbyTower}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="col-span-2 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Management */}
      <AddressManager />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 overflow-x-auto">
        <nav className="flex space-x-4 min-w-max px-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Service History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Status */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Service Status</h2>
              <div className="space-y-4">
                {currentUser.lastServiceDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span>Last Service</span>
                    </div>
                    <span>{new Date(currentUser.lastServiceDate).toLocaleDateString()}</span>
                  </div>
                )}
                {currentUser.nextServiceDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span>Next Service</span>
                    </div>
                    <span>{new Date(currentUser.nextServiceDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Important Notes</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Sign up for AMC package for most savings</li>
                    <li>• Keep your address information up to date</li>
                    <li>• Contact us if you need any support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <ServiceHistory userId={currentUser.id} limit={10} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfile;