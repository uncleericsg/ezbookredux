import React from 'react';

import AdminHeader from '@admin/AdminHeader';
import AdminNav from '@admin/AdminNav';
import UserTable from '@admin/UserTable';

import { useAppSelector } from '@store/index';

const AdminUsers = () => {
  const { currentUser } = useAppSelector((_state) => _state.user);
  const { users, loading } = useAppSelector(() => ({
    users: [], // TODO: Add users slice
    loading: false
  }));

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader title="User Management" />
      <AdminNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {/* TODO: Add user */}}
              >
                Add User
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {/* TODO: Import users */}}
              >
                Import Users
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No users found</p>
              <p className="text-gray-500 mt-2">Add users manually or import from a file</p>
            </div>
          ) : (
            <UserTable users={users} currentUser={currentUser} />
          )}
        </div>
      </main>
    </div>
  );
};

AdminUsers.displayName = 'AdminUsers';

export { AdminUsers };
export default AdminUsers;
