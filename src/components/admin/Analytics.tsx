import React, { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Loader2, TrendingUp, Users, Star } from 'lucide-react';

const Analytics: React.FC = () => {
  const { data, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-400/10 rounded-lg border border-red-400/20">
        Failed to load analytics data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active AMCs</p>
              <p className="text-3xl font-bold mt-2">{data.metrics?.activeAMCs || 0}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <div className="mt-4 text-sm text-green-400">
            +12% from last month
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed Services</p>
              <p className="text-3xl font-bold mt-2">{data.metrics?.completedServices || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
          <div className="mt-4 text-sm text-green-400">
            +8% from last month
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold mt-2">{data.metrics?.averageRating?.toFixed(1) || 0}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="mt-4 text-sm text-green-400">
            +0.2 from last month
          </div>
        </div>
      </div>

      {/* Service Bookings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Service Bookings</h2>
        <div className="h-64 flex items-end space-x-2">
          {data.bookings.map((booking) => (
            <div key={booking.month} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400"
                style={{ 
                  height: `${(booking.count / Math.max(...data.bookings.map(b => b.count))) * 100}%`,
                  minHeight: '20px'
                }}
              />
              <p className="text-sm text-gray-400 mt-2">{booking.month}</p>
              <p className="text-sm font-medium">{booking.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Customer Satisfaction</h2>
        <div className="h-64 flex items-end space-x-2">
          {data.satisfaction.map((rating) => (
            <div key={rating.rating} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-400"
                style={{ 
                  height: `${(rating.count / Math.max(...data.satisfaction.map(r => r.count))) * 100}%`,
                  minHeight: '20px'
                }}
              />
              <p className="text-sm text-gray-400 mt-2">{rating.rating}★</p>
              <p className="text-sm font-medium">{rating.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;