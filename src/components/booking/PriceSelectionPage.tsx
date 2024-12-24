/*
 * @ai-protection - DO NOT MODIFY THIS FILE
 * This is a stable version of the price selection component that:
 * 1. Displays service pricing options
 * 2. Handles price selection logic
 * 3. Manages service type categorization
 * 4. Integrates with booking flow
 * 
 * Critical Features:
 * - Dynamic price calculation
 * - Service type filtering
 * - Interactive selection UI
 * - Price validation
 * - Responsive design
 * 
 * Integration Points:
 * - Booking flow state management
 * - Service catalog
 * - Price calculation service
 * - Navigation service
 * 
 * @ai-visual-protection: The price selection UI must maintain consistent styling
 * @ai-flow-protection: The selection and validation flow must not be modified
 * @ai-state-protection: The price state management is optimized
 * 
 * Any modifications to this component could affect:
 * 1. Price calculations
 * 2. Service type categorization
 * 3. Booking flow progression
 * 4. User selection experience
 * 
 * If changes are needed:
 * 1. Verify price calculations
 * 2. Test service categorization
 * 3. Validate selection flow
 * 4. Update documentation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ServiceOption {
  id: string;
  title: string;
  price: number;
  usualPrice?: number;
  description: string;
  duration: string;
  paddingBefore: number;
  paddingAfter: number;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'single',
    title: '1 SINGLE UNIT',
    price: 60,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $20 POWERJET ON EVAP COIL DEEP CLEAN (OPTIONAL)',
    duration: '45 minutes',
    paddingBefore: 15,
    paddingAfter: 30,
  },
  {
    id: '2units',
    title: '2 UNITS',
    price: 60,
    usualPrice: 90,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '45 minutes',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: '3units',
    title: '3 UNITS',
    price: 90,
    usualPrice: 120,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '1 hour',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: '4units',
    title: '4 UNITS',
    price: 120,
    usualPrice: 160,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '1 hour',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: '5units',
    title: '5 UNITS',
    price: 150,
    usualPrice: 180,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '1 hour 30 minutes',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: '6units',
    title: '6 UNITS',
    price: 180,
    usualPrice: 200,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '1 hour 30 minutes',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: '7units',
    title: '7 UNITS',
    price: 210,
    usualPrice: 280,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '1 hour 30 minutes',
    paddingBefore: 30,
    paddingAfter: 30,
  },
  {
    id: '8plus',
    title: 'MORE THAN 8 AC UNITS',
    usualPrice: 320,
    price: 240,
    description: 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)',
    duration: '1 hour 30 minutes',
    paddingBefore: 30,
    paddingAfter: 30,
  }
];

const premiumServices: ServiceOption[] = [
  {
    id: 'premium-single',
    title: 'PREMIUM SINGLE UNIT',
    price: 80,
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    duration: '45 minutes',
    paddingBefore: 15,
    paddingAfter: 30,
  },
  {
    id: 'premium-2units',
    title: 'PREMIUM 2 UNITS',
    price: 120,
    usualPrice: 150,
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    duration: '1 hour',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: 'premium-3units',
    title: 'PREMIUM 3 UNITS',
    price: 180,
    usualPrice: 210,
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    duration: '1 hour',
    paddingBefore: 0,
    paddingAfter: 30,
  },
  {
    id: 'premium-4units',
    title: 'PREMIUM 4 UNITS',
    price: 240,
    usualPrice: 280,
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
  },
  {
    id: 'premium-5units',
    title: 'PREMIUM 5 UNITS',
    price: 300,
    usualPrice: 330,  
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    duration: '1 hour 30 minutes',
    paddingBefore: 30,
    paddingAfter: 30,
  },
  {
    id: 'premium-6units',
    title: 'PREMIUM 6 UNITS',
    price: 360,
    usualPrice: 380,  
    description: 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED',
    duration: '1 hour 30 minutes',
    paddingBefore: 30,
    paddingAfter: 30,
  },
  {
    id: 'fault-checking',
    title: 'AC FAULT CHECKING/SITE INSPECTION',
    price: 120,
    description: 'ADVANCED TROUBLESHOOTING FOR BLINKING OR SEVERE BREAKDOWNS',
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
  },
  {
    id: 'powerjet-chemical',
    title: 'POWERJET CHEMICAL WASH',
    price: 150,
    description: 'SIGNATURE POWERJET SERVICE WITH DEEP CLEANING USING COIL CHEMICALS',
    duration: '1 hour 30 minutes',
    paddingBefore: 15,
    paddingAfter: 30,
  },
  {
    id: 'gas-leakage',
    title: 'GAS CHECKING & LEAKAGE ISSUES',
    price: 130,
    description: 'FREQUENT GAS TOPUP & LEAKAGE ISSUES',
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
  }
];

const PriceSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceSelect = (service: ServiceOption) => {
    navigate('/booking/first-time', { 
      state: { 
        selectedService: service,
        fromPriceSelection: true 
      } 
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tl from-[#0c001a] via-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/20 via-transparent to-blue-400/5"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FFD700] mb-4">
            First Time Customer Offer
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            HDB & CONDOS ONLY
          </p>

          {/* Service Scope Info Section */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-sky-900/40 to-blue-900/40 p-6 rounded-xl backdrop-blur-sm border border-sky-500/30 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-sky-400">Premium Service Scope</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {serviceOptions.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800/50 border border-gray-700/70 rounded-lg p-6 cursor-pointer hover:border-[#FFD700]/30 transition-all duration-200 backdrop-blur-sm shadow-lg relative flex flex-col"
              onClick={() => handleServiceSelect(service)}
            >
              {service.usualPrice && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                    Save ${service.usualPrice - service.price}
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-[#FFD700] mb-4">{service.title}</h3>
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="text-3xl font-bold text-white">
                  ${service.price}
                </div>
                {service.usualPrice && (
                  <div className="text-sm text-gray-400 line-through mt-1">
                    Usual ${service.usualPrice}
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration: {service.duration}
                </div>
              </div>
            </div>
          ))}
          
          {/* WhatsApp Contact Card */}
          <a 
            href="https://wa.me/6591874498" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-emerald-900/40 to-slate-900/60 border-2 border-[#25D366]/20 rounded-lg p-6 cursor-pointer hover:border-[#25D366]/40 hover:shadow-lg hover:shadow-[#25D366]/10 transition-all duration-200 backdrop-blur-sm flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#25D366] to-emerald-600 text-white px-3 py-1 rounded-bl-lg font-semibold text-sm">
              CONTACT
            </div>
            <div className="absolute inset-0 bg-[#25D366]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            <div className="flex flex-col items-center gap-4">
              <svg className="w-12 h-12 text-[#25D366] transform group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <h3 className="text-xl font-bold text-[#25D366] mb-1">Need More Units?</h3>
                <p className="text-gray-300 text-sm">Contact us for custom quotes</p>
              </div>
            </div>
            
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 text-[#25D366] text-sm font-medium">
                Chat with us on WhatsApp
              </span>
            </div>
          </a>
        </div>

        {/* Premium Services Header */}
        <div className="col-span-full text-center mt-12 mb-8">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-2">Premium Services</h2>
          <p className="text-gray-400">Professional Powerjet Wash & Specialized Services</p>
        </div>

        {/* Premium Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {premiumServices.map((service) => (
            <div
              key={service.id}
              className={`${
                service.id === 'fault-checking'
                  ? 'bg-gradient-to-br from-rose-900/40 to-slate-900/60 border-2 border-rose-500/30 hover:border-rose-500/70 hover:shadow-lg hover:shadow-rose-500/30'
                  : service.id === 'powerjet-chemical'
                  ? 'bg-gradient-to-br from-cyan-900/40 to-slate-900/60 border-2 border-cyan-500/30 hover:border-cyan-500/70 hover:shadow-lg hover:shadow-cyan-500/30'
                  : service.id === 'gas-leakage'
                  ? 'bg-gradient-to-br from-amber-900/40 to-slate-900/60 border-2 border-amber-500/30 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-500/30'
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-[#FFD700]/30 hover:border-[#FFD700] hover:shadow-[#FFD700]/20'
              } rounded-lg p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-lg relative flex flex-col`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className={`absolute top-0 right-0 ${
                service.id === 'fault-checking'
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white'
                  : service.id === 'powerjet-chemical'
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                  : service.id === 'gas-leakage'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-[#FFD700] text-black'
              } px-3 py-1 rounded-bl-lg font-semibold text-sm flex items-center gap-2`}>
                {service.id === 'fault-checking' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2.01L9 9l-2 2 2.828-2.828M9 12l2 2 4-4m5 2.01L9 9l-2 2 2.828-2.828" />
                    </svg>
                    INSPECTION
                  </>
                ) : service.id === 'powerjet-chemical' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    CHEMICAL WASH
                  </>
                ) : service.id === 'gas-leakage' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    GAS SERVICE
                  </>
                ) : 'PREMIUM'}
              </div>
              
              <h3 className={`text-xl font-bold ${
                service.id === 'fault-checking' 
                ? 'text-rose-300'
                : service.id === 'powerjet-chemical'
                ? 'text-cyan-300'
                : service.id === 'gas-leakage'
                ? 'text-amber-300'
                : 'text-[#FFD700]'
              } mb-4 mt-4`}>{service.title}</h3>
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="text-3xl font-bold text-white">
                  ${service.price}
                </div>
                {service.usualPrice && (
                  <div className="text-sm text-gray-400 line-through mt-1">
                    Usual ${service.usualPrice}
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-sm mb-4">{service.description}</p>
              <div className="text-sm text-gray-400">
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${
                    service.id === 'fault-checking'
                    ? 'text-rose-400'
                    : service.id === 'powerjet-chemical'
                    ? 'text-cyan-400'
                    : service.id === 'gas-leakage'
                    ? 'text-amber-400'
                    : 'text-[#FFD700]'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration: {service.duration}
                </div>
                {service.id === 'fault-checking' && (
                  <div className="mt-4 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Professional Diagnosis
                    </span>
                  </div>
                )}
                {service.id === 'powerjet-chemical' && (
                  <div className="mt-4 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Deep Chemical Clean
                    </span>
                  </div>
                )}
                {service.id === 'gas-leakage' && (
                  <div className="mt-4 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Gas System Check
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceSelectionPage;
