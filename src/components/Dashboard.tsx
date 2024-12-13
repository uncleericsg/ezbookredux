import React from 'react';
import { Calendar, Clock, ArrowUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import ServiceHub from './admin/ServiceHub/ServiceHub';

interface ServiceRequest {
  id: string;
  customerName: string;
  serviceType: 'maintenance' | 'repair' | 'installation'
  scheduledTime: Date;
  location: string;
  contactNumber?: string;  // Added
  notes?: string;         // Added
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  // If user is admin, show ServiceHub, otherwise show customer dashboard
  if (currentUser?.role === 'admin') {
    return <ServiceHub />;
  }

  return (
    <div className="space-y-6">
      {/* AMC Status Card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AMC Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            currentUser?.amcStatus === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-600 text-gray-300'
          }`}>
            {currentUser?.amcStatus === 'active' ? 'Active' : 'Non-AMC'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Next Service Due</p>
              <p className="font-medium">{currentUser?.nextServiceDate ? new Date(currentUser.nextServiceDate).toLocaleDateString() : 'Not scheduled'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">{currentUser?.amcStatus === 'active' ? 'Contract Expires' : 'Last Service'}</p>
              <p className="font-medium">{currentUser?.lastServiceDate ? new Date(currentUser.lastServiceDate).toLocaleDateString() : 'No history'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg flex items-center justify-center space-x-2"
        >
          <Calendar className="h-5 w-5" />
          <span>Schedule Service</span>
        </button>
        <button 
          onClick={() => navigate('/amc-package-signup')}
          className="bg-[#deab02] hover:bg-[#c59a02] p-4 rounded-lg flex items-center justify-center space-x-2"
        >
          <ArrowUp className="h-5 w-5" />
          <span>AMC Upgrade</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="bg-[#6b00f7] hover:bg-[#5900d1] p-4 rounded-lg flex items-center justify-center space-x-2"
        >
          <User className="h-5 w-5" />
          <span>View Profile</span>
        </button>
      </div>

      {/* Recent Services */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Services</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">Regular Maintenance</p>
                <p className="text-sm text-gray-400">February {index * 5}, 2024</p>
              </div>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;