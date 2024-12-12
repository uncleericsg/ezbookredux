import React from 'react';
import { Calendar, Star, Clock, Crown, ArrowRight } from 'lucide-react';
import { MembershipTier } from '../../types/user';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

interface ProfileStatsProps {
  totalBookings: number;
  completedServices: number;
  memberSince: string;
  membershipTier: MembershipTier;
  nextServiceDate?: string;
  contractExpiryDate?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalBookings,
  completedServices,
  memberSince,
  membershipTier,
  nextServiceDate,
  contractExpiryDate,
}) => {
  const formattedDate = React.useMemo(() => {
    try {
      return format(parseISO(memberSince), 'MMMM dd, yyyy');
    } catch {
      return memberSince;
    }
  }, [memberSince]);

  const formatDate = (date?: string) => {
    if (!date) return 'Not scheduled';
    try {
      return format(parseISO(date), 'MMMM dd, yyyy');
    } catch {
      return date;
    }
  };

  const CustomerTypePanel = () => (
    <div className="relative flex items-center justify-between">
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="text-gray-400 text-sm font-medium">Customer Type</p>
          {membershipTier === 'AMC' && (
            <span className="px-2 py-1 bg-amber-500/20 rounded-full text-xs font-semibold text-amber-400">
              AMC
            </span>
          )}
        </div>
        <p className="text-xl font-bold text-white mt-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
          {membershipTier === 'AMC' ? 'AMC Member' : 'Regular Customer'}
        </p>
        <p className="text-sm text-gray-400 mt-1 transition-all duration-300 ease-in-out group-hover:text-gray-300">
          Customer Since: {formattedDate}
        </p>
        {membershipTier === 'AMC' ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Next Service Due</p>
                <p className="font-medium text-white">{formatDate(nextServiceDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Contract Expires</p>
                <p className="font-medium text-white">{formatDate(contractExpiryDate)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium group-hover:bg-amber-500/30">
            Upgrade to AMC
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </div>
        )}
      </div>
      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-amber-500/30 group-hover:shadow-lg group-hover:shadow-amber-500/20">
        <Crown className="w-6 h-6 text-amber-400 transition-transform duration-300 ease-in-out group-hover:scale-110" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {membershipTier === 'AMC' ? (
        <div className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-amber-500/20"></div>
          <CustomerTypePanel />
        </div>
      ) : (
        <Link 
          to="/amc-packages"
          className="block relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out group overflow-hidden hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-amber-500/20"></div>
          <CustomerTypePanel />
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Completed Services</p>
              <p className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{completedServices}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Member Since</p>
              <p className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{formattedDate}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
