import React, { useState } from 'react';
import { Search, Save, X, Loader2 } from 'lucide-react';
import { useUserTable } from '../../hooks/useUserTable';
import UserImport from './UserImport';
import { updateUser } from '../../services/admin';
import { toast } from 'sonner';
import type { User } from '../../types';
import UserTable from './UserTable';
import { motion } from 'framer-motion';

const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handleItemsPerPageChange,
    handleDeactivate
  } = useUserTable();
  const [showImportSection, setShowImportSection] = useState(false);

  const handleEdit = (user: User) => {
    // Pass user object to UserTable for editing
    handleEditUser(user);
  };

  const handleSaveUser = async (userId: string, data: Partial<User>) => {
    try {
      await updateUser(userId, data);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
      throw error;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      <div className="p-4 border-b border-gray-700">
        <div className="relative flex flex-col md:flex-row items-center gap-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <UserTable
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          onSave={handleSaveUser}
          loading={loading}
        />

        {/* Import Section */}
        <motion.div 
          className="p-6 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setShowImportSection(!showImportSection)}
            className="w-full md:w-auto btn btn-secondary mb-4 py-3 md:py-2 text-base md:text-sm"
          >
            {showImportSection ? 'Hide Import Section' : 'Show Import Section'}
          </button>

          {showImportSection && (
            <div className="space-y-6">
              <UserImport />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

UserManagement.displayName = 'UserManagement';

export { UserManagement };
export default UserManagement;