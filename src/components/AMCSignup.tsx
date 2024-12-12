import React from 'react';
import { Shield, CheckCircle, Star, Clock, Calendar, Tool } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AMCSignup: React.FC = () => {
  const navigate = useNavigate();

  const packages = [
    {
      id: '1-unit',
      name: '1 Unit',
      price: 280,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ]
    },
    {
      id: '2-units',
      name: '2 Units',
      price: 280,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ]
    },
    {
      id: '3-units',
      name: '3 Units',
      price: 380,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ]
    },
    {
      id: '4-units',
      name: '4 Units',
      price: 480,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ]
    },
    {
      id: '5-units',
      name: '5 Units',
      price: 580,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ]
    },
    {
      id: '6-units',
      name: '6 Units',
      price: 680,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ]
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    navigate('/amc-subscription', { state: { packageId } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[#FFD700] text-4xl font-bold mb-4">Quality AMC Packages</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose your Annual Maintenance Contract (AMC) package
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Contact us for more than 6 units
          </p>
        </motion.div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <h3 className="font-semibold">365 Days Coverage</h3>
          </div>
          <p className="text-gray-400">Full year of comprehensive maintenance and support</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Star className="h-6 w-6 text-yellow-400" />
            <h3 className="font-semibold">4.9/5 Rating</h3>
          </div>
          <p className="text-gray-400">Consistently rated 5 stars by our AMC customers</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="h-6 w-6 text-green-400" />
            <h3 className="font-semibold">Quick Response</h3>
          </div>
          <p className="text-gray-400">Priority service with guaranteed response times</p>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: packages.indexOf(pkg) * 0.1 }}
            className="relative bg-gray-800 rounded-lg p-6 border border-gray-700 transition-all hover:border-[#FFD700]/50"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFD700] text-gray-900 text-sm font-medium rounded-full">
              Most Savings
            </span>

            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-[#FFD700]" />
              <h3 className="text-xl font-semibold text-[#FFD700]">{pkg.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold">${pkg.price}</span>
              <span className="text-gray-400">/year</span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FFD700] flex-shrink-0" />
                <span className="text-gray-300">{pkg.visits} Service Visits</span>
              </li>
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePackageSelect(pkg.id)}
              className="w-full btn btn-primary"
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>

      {/* Terms & Conditions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Service Coverage</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Regular maintenance visits scheduled quarterly</li>
              <li>Emergency service calls as per package terms</li>
              <li>Parts coverage varies by package level</li>
              <li>Service window: 9:30 AM - 5:00 PM, Mon-Fri</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-300 mb-2">Contract Terms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>12-month contract duration</li>
              <li>Payment required upfront</li>
              <li>30-day satisfaction guarantee</li>
              <li>Transferable ownership with notice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMCSignup;