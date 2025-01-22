import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import {
  LayoutGrid as HomeIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  MapPinned as MapPinIcon
} from 'lucide-react';
import type { ProfileTabsProps, ProfileTabItem, ProfileTab } from '@/types/profile-tabs';

interface MotionDivProps extends MotionProps {
  layoutId?: string;
  className?: string;
  transition?: {
    type: string;
    duration: number;
  };
}

const tabs: ProfileTabItem[] = [
  { id: 'overview', label: 'Overview', icon: HomeIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'bookings', label: 'Bookings', icon: CalendarIcon },
  { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, className }) => {
  return (
    <div className={`flex space-x-1 bg-gray-800 p-1 rounded-lg ${className || ''}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as ProfileTab)}
            className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon className="w-5 h-5" />
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
