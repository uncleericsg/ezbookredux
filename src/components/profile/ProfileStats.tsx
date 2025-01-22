import React from 'react';
import { Calendar, Award as Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProfileStatsProps, StatsCardProps } from '@/types/profile-stats';
import { formatProfileDate } from '@/types/profile-stats';
import CustomerTypePanel from './CustomerTypePanel';

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  gradientFrom,
  iconBgColor,
  iconColor
}) => (
  <div className={`relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}/10 to-transparent`}></div>
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{value}</p>
      </div>
      <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalBookings,
  completedServices,
  memberSince,
  membershipTier,
  nextServiceDate,
  contractExpiryDate,
}) => {
  const formattedDate = formatProfileDate(memberSince);

  const statsCards = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      gradientFrom: 'blue-500',
      iconBgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Completed Services',
      value: completedServices,
      icon: Star,
      gradientFrom: 'green-500',
      iconBgColor: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      title: 'Member Since',
      value: formattedDate,
      icon: Clock,
      gradientFrom: 'purple-500',
      iconBgColor: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      {membershipTier === 'AMC' ? (
        <div className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-amber-500/20"></div>
          <CustomerTypePanel
            membershipTier={membershipTier}
            memberSince={memberSince}
            nextServiceDate={nextServiceDate}
            contractExpiryDate={contractExpiryDate}
          />
        </div>
      ) : (
        <Link
          to="/amc-packages"
          className="block relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group overflow-hidden hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-amber-500/20"></div>
          <CustomerTypePanel
            membershipTier={membershipTier}
            memberSince={memberSince}
            nextServiceDate={nextServiceDate}
            contractExpiryDate={contractExpiryDate}
          />
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
