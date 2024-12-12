import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit, ChevronLeft, ChevronRight, Save, X, UserX } from 'lucide-react';
import type { User } from '../../types';
import UserStatusToggle from './UserStatusToggle';

interface UserTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  onEdit: (user: User) => void;
  onDeactivate: (userId: string) => Promise<void>;
  onSave: (userId: string, data: Partial<User>) => Promise<void>;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onDeactivate,
  onSave,
  loading = false
}) => {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  };

  const handleSave = async (userId: string) => {
    try {
      await onSave(userId, editForm);
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({});
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="overflow-x-auto">
        <div className="hidden md:block"> {/* Desktop View */}
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="p-4 font-medium text-gray-400">Name</th>
                <th className="p-4 font-medium text-gray-400">Email</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
                <th className="p-4 font-medium text-gray-400">Registration Date</th>
                <th className="p-4 font-medium text-gray-400">Last Login</th>
                <th className="p-4 font-medium text-gray-400">Role</th>
                <th className="p-4 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="p-4">
                    {editingUser === user.id ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24"
                        />
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24"
                        />
                      </div>
                    ) : (
                      `${user.firstName} ${user.lastName}`
                    )}
                  </td>
                  <td className="p-4">
                    {editingUser === user.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.amcStatus === 'active' 
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.amcStatus}
                    </span>
                  </td>
                  <td className="p-4">{format(new Date(), 'PP')}</td>
                  <td className="p-4">{format(new Date(), 'PP p')}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {editingUser === user.id ? (
                        <>
                          <button
                            onClick={() => handleSave(user.id)}
                            className="btn-icon text-green-400"
                            title="Save changes"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="btn-icon text-gray-400"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn-icon"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      <UserStatusToggle
                        userId={user.id}
                        isActive={user.amcStatus === 'active'}
                        onToggle={async (id, newStatus) => {
                          await onDeactivate(id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {users.map((user) => (
            <div key={user.id} className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  user.amcStatus === 'active' 
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {user.amcStatus}
                </span>
              </div>
              
              <div className="text-sm text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span>{format(new Date(), 'PP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Login:</span>
                  <span>{format(new Date(), 'PP p')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span>{user.role}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-600">
                {editingUser === user.id ? (
                  <>
                    <button
                      onClick={() => handleSave(user.id)}
                      className="btn-icon text-green-400"
                      title="Save changes"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-icon text-gray-400"
                      title="Cancel"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(user)}
                      className="btn-icon"
                      title="Edit user"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeactivate(user.id)}
                      className="btn-icon text-red-400"
                      title="Deactivate user"
                    >
                      <UserX className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 md:py-1.5 w-full md:w-auto text-base md:text-sm"
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <span className="text-base md:text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-icon disabled:opacity-50 p-3 md:p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-icon disabled:opacity-50 p-3 md:p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;