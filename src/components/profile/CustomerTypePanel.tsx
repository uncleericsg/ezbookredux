import React from 'react';
import { Calendar, Timer as Clock, Award as Crown, ArrowRight } from 'lucide-react';
import type { CustomerTypePanelProps } from '@/types/profile-stats';
import { formatProfileDate } from '@/types/profile-stats';

export const CustomerTypePanel: React.FC<CustomerTypePanelProps> = ({
  membershipTier,
  memberSince,
  nextServiceDate,
  contractExpiryDate
}) => {
  const formattedMemberSince = formatProfileDate(memberSince);

  return (
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
          Customer Since: {formattedMemberSince}
        </p>
        {membershipTier === 'AMC' ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Next Service Due</p>
                <p className="font-medium text-white">
                  {nextServiceDate ? formatProfileDate(nextServiceDate) : 'Not scheduled'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Contract Expires</p>
                <p className="font-medium text-white">
                  {contractExpiryDate ? formatProfileDate(contractExpiryDate) : 'Not set'}
                </p>
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
};

export default CustomerTypePanel;