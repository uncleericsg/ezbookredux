import React from 'react';
import type { AdminNavProps } from '../../shared/types/admin';

const NAV_ITEMS = [
  { id: 0, label: 'Dashboard' },
  { id: 1, label: 'Bookings' },
  { id: 2, label: 'Users' },
  { id: 3, label: 'Settings' }
];

const AdminNav: React.FC<AdminNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

AdminNav.displayName = 'AdminNav';

export { AdminNav };
export default AdminNav;
