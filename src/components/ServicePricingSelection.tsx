// @ai-visual-protection: This component's visual design and styling must be preserved exactly as is.
// Any modifications should only affect functionality, not appearance.

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Timer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Services
import { getServicePricing } from '@services/serviceManager';
import { validateBookingDetails } from '@utils/validation';

interface PricingOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

interface SavedLocation {
  id: string;
  address: string;
  postalCode: string;
  unitNumber: string;
  default: boolean;
}

interface SavedDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  locations: SavedLocation[];
}

interface ServicePricingSelectionProps {
  onSelect?: (option: PricingOption) => void;
  onSavedDetailsSelect?: (details: SavedDetails, location: SavedLocation, service: PricingOption) => void;
}

const pricingOptions: PricingOption[] = [
  {
    id: 'single',
    title: 'SINGLE UNIT',
    price: 60,
    duration: '30 minutes',
    description: 'OPTIONAL TO ADDON $20 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true,
    promoLabel: "Premium"
  },
  {
    id: '2units',
    title: '2 UNITS',
    price: 90,
    duration: '45 minutes',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  },
  {
    id: '3units',
    title: '3 UNITS',
    price: 120,
    duration: '1 hour',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  },
  {
    id: '4units',
    title: '4 UNITS',
    price: 160,
    duration: '1 hour',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  },
  {
    id: '5units',
    title: '5 UNITS',
    price: 180,
    duration: '1 hour',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  },
  {
    id: '6units',
    title: '6 UNITS',
    price: 200,
    duration: '1 hour 30 minutes',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  },
  {
    id: '7plus',
    title: '7 UNITS',
    price: 280,
    duration: '1 hour 30 minutes',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  },
  {
    id: '8units',
    title: '8 UNITS',
    price: 320,
    duration: '1 hour 30 minutes',
    description: 'OPTIONAL TO ADDON $30 POWERJET ON EVAP COIL PER AC, DIFFERENT AC CONDITION VARIES',
    isPromo: true
  }
];

const signatureOptions: PricingOption[] = [
  {
    id: 'signature-single',
    title: 'SIGNATURE 1 UNIT',
    price: 80,
    duration: '45 minutes',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-2units',
    title: 'SIGNATURE 2 UNITS',
    price: 150,
    duration: '1 hour',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-3units',
    title: 'SIGNATURE 3 UNITS',
    price: 210,
    duration: '1 hour',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-4units',
    title: 'SIGNATURE 4 UNITS',
    price: 280,
    duration: '1 hour 30 minutes',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-5units',
    title: 'SIGNATURE 5 UNITS',
    price: 330,
    duration: '1 hour 30 minutes',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-6units',
    title: 'SIGNATURE 6 UNITS',
    price: 380,
    duration: '1 hour 30 minutes',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-7units',
    title: 'SIGNATURE 7 UNITS',
    price: 490,
    duration: '1 hour 30 minutes',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  },
  {
    id: 'signature-8units',
    title: 'SIGNATURE 8 UNITS',
    price: 560,
    duration: '1 hour 30 minutes',
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    isSignature: true
  }
];

const ServicePricingSelection: React.FC<ServicePricingSelectionProps> = ({
  onSelect,
}) => {
  const navigate = useNavigate();

  const handlePricingClick = (pricing: PricingOption) => {
    console.log('[DEBUG] ServicePricingSelection - Click handler start');
    
    if (!onSelect) {
      console.warn('[DEBUG] ServicePricingSelection - No onSelect handler provided');
      return;
    }

    try {
      console.log('[DEBUG] ServicePricingSelection - Calling onSelect with:', pricing);
      onSelect(pricing);
    } catch (error) {
      console.error('[DEBUG] ServicePricingSelection - Error in onSelect:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="relative">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our Services
            </motion.h1>
            
            {/* Service Scope Info Section */}
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-sky-900/40 to-blue-900/40 p-8 rounded-xl backdrop-blur-sm border border-sky-500/30 shadow-lg mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-sky-400">Premium Service Scope</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Our comprehensive air conditioning service delivers a thorough system restoration, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Deep cleaning of covers and air filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Professional blower fan maintenance</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Water tray sanitization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive system health assessment</span>
                  </li>
                </ul>
              </div>
              <p className="text-sky-400/90 mt-4 font-medium">
                Our purpose: Restore AC units to peak performances, maintain optimal comfort, energy efficiency, prolong lifespan and enhance durability
              </p>
            </div>
          </div>

          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold text-[#FFD700] mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Return Customers
            </motion.h2>
            <p className="text-xl text-gray-300 mb-2">
              Choose Your Premium Service Package
            </p>
            <p className="text-base text-gray-400">
              Professional AC servicing tailored to your needs
            </p>
          </div>

          {/* Regular Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {pricingOptions.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                className={`relative overflow-hidden rounded-xl ${
                  option.isPromo 
                    ? 'bg-gradient-to-br from-indigo-900/80 to-purple-900/90 border-indigo-700/50 hover:border-[#FFD700]/30'
                    : 'bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-gray-700/50 hover:border-[#FFD700]/30'
                } border p-8 shadow-lg backdrop-blur-sm cursor-pointer text-left w-full`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePricingClick(option)}
                data-testid={`pricing-option-${option.id}`}
              >
                {(option.isPromo || option.isSignature) && (
                  <div className="absolute top-4 right-4">
                    <span className={`${
                      option.isSignature 
                        ? 'bg-[#004e92]'
                        : 'bg-indigo-600'
                    } text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                      {option.promoLabel || (option.isSignature ? "Signature" : "Premium")}
                    </span>
                  </div>
                )}

                <motion.h3 
                  className="text-xl font-bold text-[#FFD700] mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  {option.title}
                </motion.h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold mb-4">
                      ${option.price}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-sky-400" />
                    <span className="text-gray-300">{option.duration}</span>
                  </div>

                  {option.description && (
                    <div className="text-sm text-gray-400">
                      {option.description}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Signature Service Cards */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              SIGNATURE POWERJET SERVICES
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8">
              Premium deep cleaning with PowerJet technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {signatureOptions.map((option) => (
              <motion.button
                key={option.id}
                className="relative overflow-hidden rounded-xl bg-[linear-gradient(to_bottom_right,#000428,#004e92)] border border-blue-700/50 hover:border-[#FFD700]/30 p-8 shadow-lg backdrop-blur-sm cursor-pointer text-left w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePricingClick(option)}
                type="button"
                aria-label={`Select ${option.title} pricing option`}
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-[#004e92] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Signature
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <motion.h3 
                    className="text-xl font-bold text-yellow-400"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    {option.title}
                  </motion.h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold mb-4 text-white">
                      ${option.price}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-300">{option.duration}</span>
                  </div>

                  {option.description && (
                    <div className="text-sm text-yellow-400/90 font-medium">
                      {option.description}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* WhatsApp Contact Card */}
          <motion.a 
            href="https://wa.me/6591874498" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900/40 to-slate-900/60 border border-green-700/50 hover:border-green-500/70 hover:shadow-green-500/30 p-8 shadow-lg backdrop-blur-sm flex flex-col items-center justify-center text-center group mt-8 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 group-hover:scale-110 transition-transform duration-300">
              <svg
                viewBox="0 0 32 32"
                className="w-8 h-8 text-green-400"
                fill="currentColor"
              >
                <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2zm7.34 19.72c-.34.96-1.68 1.76-2.76 2-.71.15-1.64.27-4.77-.96-4.01-1.58-6.59-5.46-6.79-5.71-.19-.25-1.6-2.13-1.6-4.06 0-1.93 1.02-2.88 1.38-3.27.34-.37.74-.46.99-.46.25 0 .5 0 .72.01.23.01.54-.09.84.64.31.75 1.05 2.59 1.14 2.78.1.19.16.41.03.66-.13.25-.19.41-.38.64-.19.23-.4.52-.17.76.22.36.99 1.54 2.13 2.49 1.46 1.23 2.69 1.61 3.07 1.79.38.18.6.16.82-.09.22-.25.95-1.11 1.2-1.49.25-.38.5-.32.84-.19.34.13 2.18 1.03 2.56 1.21.38.18.63.27.72.42.09.15.09.88-.25 1.84z"/>
              </svg>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-green-300 mb-3">Need Help?</h3>
              <p className="text-gray-300 mb-2">Chat with us on WhatsApp</p>
              <p className="text-sm text-gray-400">Available 24/7 for your inquiries</p>
            </div>
            <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-green-700/50">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Instant Response Team</span>
            </div>
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export { ServicePricingSelection };
export default ServicePricingSelection;
