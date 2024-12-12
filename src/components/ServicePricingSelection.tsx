// @ai-visual-protection: This component's visual design and styling must be preserved exactly as is.
// Any modifications should only affect functionality, not appearance.

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Timer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            
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
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6">
              Return Customers
            </h2>
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

                <h3 className="text-xl font-bold text-[#FFD700] mb-4">{option.title}</h3>
                
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-6">
              SIGNATURE POWERJET SERVICES
            </h2>
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
                  <h3 className="text-xl font-bold text-yellow-400">{option.title}</h3>
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
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-950/95 via-emerald-900/90 to-green-900/95 border-2 border-emerald-700/50 p-8 shadow-lg backdrop-blur-sm flex flex-col items-center justify-center text-center hover:border-[#25D366]/50 hover:shadow-[#25D366]/20 group mt-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-800 to-green-800 text-white px-3 py-1 rounded-bl-lg font-semibold text-sm shadow-lg">
              WhatsApp
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/20 to-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-xl font-bold text-[#25D366] mb-4 mt-4">Need More Units?</h3>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-gray-300">Contact us on WhatsApp!</span>
            </div>
            <div className="mt-6">
              <motion.div
                className="h-1 bg-gradient-to-r from-[#25D366]/50 to-transparent rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default ServicePricingSelection;
