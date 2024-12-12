import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Home } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-md -z-10"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
