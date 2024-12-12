import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, History, Copy, MapPin, Calendar, Wrench } from 'lucide-react';
import { BookingDetails } from '../../services/bookingService';

interface QuickBookingPromptProps {
  previousBooking: BookingDetails;
  onQuickBook: (useLastDetails: boolean) => void;
}

export const QuickBookingPrompt: React.FC<QuickBookingPromptProps> = ({
  previousBooking,
  onQuickBook,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-800"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-white">
          Welcome Back, {previousBooking.customerInfo.firstName}!
        </h2>
        <p className="text-gray-400">Would you like to book the same service as before?</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="font-medium text-lg mb-3 text-gray-200">Previous Booking Details:</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <Wrench className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-400">AC Brands</p>
                <p className="font-medium text-white">{previousBooking.brands.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Wrench className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-400">Issues</p>
                <p className="font-medium text-white">{previousBooking.issues.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-400">Service Location</p>
                <p className="font-medium text-white">
                  {previousBooking.customerInfo.floorUnit}, {previousBooking.customerInfo.blockStreet}
                  {previousBooking.customerInfo.condoName && `, ${previousBooking.customerInfo.condoName}`}
                </p>
                <p className="text-gray-500">S({previousBooking.customerInfo.postalCode})</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
              <div>
                <p className="text-gray-400">Last Service Date</p>
                <p className="font-medium text-white">
                  {new Date(previousBooking.lastServiceDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onQuickBook(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-colors duration-200 border border-blue-500"
          >
            <div className="flex items-center">
              <Copy className="w-5 h-5 mr-3" />
              <span>Quick Book - Same as Before</span>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onQuickBook(false)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-200 transition-colors duration-200 border border-gray-700"
          >
            <div className="flex items-center">
              <History className="w-5 h-5 mr-3" />
              <span>New Booking - Different Details</span>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
