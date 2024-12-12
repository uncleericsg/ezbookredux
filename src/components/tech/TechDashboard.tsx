import React from 'react';
import { useUser } from '../../contexts/UserContext';

const TechDashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Technician Dashboard</h1>
      
      {/* Technician Info */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Technician Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Name</p>
            <p>{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-gray-400">Team ID</p>
            <p>{user?.teamId || 'Not Assigned'}</p>
          </div>
          <div>
            <p className="text-gray-400">Specializations</p>
            <p>{user?.specializations?.join(', ') || 'None specified'}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p>{user?.availability || 'Available'}</p>
          </div>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Assignments</h3>
          <p className="text-gray-400">No assignments for today</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Upcoming Schedule</h3>
          <p className="text-gray-400">No upcoming appointments</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Recent Activities</h3>
          <p className="text-gray-400">No recent activities</p>
        </div>
      </div>
    </div>
  );
};

export default TechDashboard;
