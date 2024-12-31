import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, Flame, AlertTriangle, Clock, Star, Droplet } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface ServiceCard {
  id: string;
  title: string;
  icon: JSX.Element;
  benefits: string[];
  price: string;
  isPopular?: boolean;
}

const services: ServiceCard[] = [
  {
    id: 'basic-check',
    title: 'Basic Gas Check',
    icon: <Droplet className="w-8 h-8" />,
    benefits: ['Initial system inspection', 'Basic pressure test', 'Safety assessment'],
    price: '$80-$100'
  },
  {
    id: 'leak-detection',
    title: 'Leak Detection',
    icon: <AlertTriangle className="w-8 h-8" />,
    benefits: ['Advanced leak detection', 'Pinpoint leak locations', 'Detailed report'],
    price: '$120-$150'
  },
  {
    id: 'repair-service',
    title: 'Leak Repair',
    icon: <Flame className="w-8 h-8" />,
    benefits: ['Professional repairs', 'Sealant application', 'System testing'],
    price: '$150-$200'
  },
  {
    id: 'premium-package',
    title: 'Complete Gas Solution',
    icon: <Shield className="w-8 h-8" />,
    benefits: ['Full system check', 'Leak detection & repair', '1 year warranty'],
    price: '$250-$300',
    isPopular: true
  }
];

const GasCheckLeakage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoFocus = searchParams.get('autoFocus') === 'true';
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (autoFocus) {
      window.scrollTo(0, 0);
    }
  }, [autoFocus]);

  const handleSelectService = () => {
    console.log('[GasCheckLeakage] Navigating to confirmation page');
    navigate('/booking/confirmation');
  };

  return (
    <div className="w-full bg-gradient-to-b from-teal-950 via-blue-950 to-gray-950 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
            <motion.h1 
              className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Gas Check & Leakage Services
            </motion.h1>
            <motion.p 
              className="text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Ensuring Safety and Efficiency in Your Gas Systems
            </motion.p>
            <motion.div 
              className="max-w-2xl mx-auto text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.p className="mb-4">
              Our certified technicians provide comprehensive gas system checks and 
              leakage detection services to keep your home safe and efficient.
              </motion.p>
            </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className={`relative rounded-xl p-8 shadow-2xl backdrop-blur-sm ${
                service.isPopular 
                  ? 'bg-gradient-to-br from-orange-900/80 to-amber-900/90 border-orange-700/50'
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-gray-700/50'
              } border`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Popular Badge */}
              {service.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl">
                  Most Popular
                </div>
              )}

              {/* Card Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                    {service.icon}
                  </div>
                  <motion.h2 
                    className="text-2xl font-bold text-orange-400"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {service.title}
                  </motion.h2>
                </div>

                {/* Benefits List */}
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Price Section */}
                <div className="mt-6">
                  <p className="text-xl font-semibold text-white">
                    {service.price}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Features Section */}
        <div className="mt-20">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-8">
            Why Choose Our Gas Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h3 
                className="text-xl font-bold text-orange-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Certified Technicians
              </motion.h3>
              <p className="text-gray-300">
                Our team is fully certified and trained in gas system safety and maintenance.
              </p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h3 
                className="text-xl font-bold text-orange-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Advanced Equipment
              </motion.h3>
              <p className="text-gray-300">
                We use state-of-the-art detection equipment to ensure accurate results.
              </p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h3 
                className="text-xl font-bold text-orange-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Safety First
              </motion.h3>
              <p className="text-gray-300">
                Your safety is our top priority. We follow strict safety protocols.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-8">
            Customer Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl">
              <p className="text-gray-300 italic mb-4">
                "The gas check service gave me peace of mind about my home's safety. Highly professional!"
              </p>
              <p className="text-gray-400">- Emily R.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl">
              <p className="text-gray-300 italic mb-4">
                "They found and fixed a leak I didn't even know I had. Excellent service!"
              </p>
              <p className="text-gray-400">- David K.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasCheckLeakage;
