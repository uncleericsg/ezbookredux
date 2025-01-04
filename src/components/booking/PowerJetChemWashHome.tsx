import { motion } from 'framer-motion';
import { Zap, CheckCircle, Shield, Droplet, Settings, Wind, Thermometer, Clock, Star } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface ServiceCard {
  id: string;
  title: string;
  icon: JSX.Element;
  benefits: string[];
  price: string;
  regularPrice: string;
  discountedPrice: string;
  duration: string;
  isPopular?: boolean;
  padding?: {
    before: number;
    after: number;
  };
}

const services: ServiceCard[] = [
  {
    id: '1-unit',
    title: 'PowerJet Chemical Wash - 1 Unit',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Removes 99.9% contaminants', 'Restores airflow', 'Improves efficiency'],
    price: '120',
    regularPrice: '130',
    discountedPrice: '120',
    duration: '1 hour',
    padding: { before: 15, after: 30 }
  },
  {
    id: '2-units',
    title: 'PowerJet Chemical Wash - 2 Units',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Removes stubborn buildup', 'Prevents corrosion', 'Extends coil life'],
    price: '240',
    regularPrice: '260',
    discountedPrice: '240',
    duration: '1 hour',
    padding: { before: 15, after: 30 }
  },
  {
    id: '3-units',
    title: 'PowerJet Chemical Wash - 3 Units',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Comprehensive cleaning', 'Includes all components', 'Full system optimization'],
    price: '360',
    regularPrice: '390',
    discountedPrice: '360',
    duration: '1 hour',
    padding: { before: 15, after: 30 }
  },
  {
    id: '4-units',
    title: 'PowerJet Chemical Wash - 4 Units',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Kills mold spores', 'Prevents regrowth', 'Improves air quality'],
    price: '480',
    regularPrice: '520',
    discountedPrice: '480',
    duration: '1 hour',
    padding: { before: 15, after: 30 }
  },
  {
    id: '5-units',
    title: 'PowerJet Chemical Wash - 5 Units',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Increases airflow by 40%', 'Reduces energy costs', 'Improves comfort'],
    price: '600',
    regularPrice: '650',
    discountedPrice: '600',
    duration: '1 hour',
    padding: { before: 15, after: 30 }
  },
  {
    id: 'deep-clean',
    title: 'Deep System Clean',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Removes 99.9% contaminants', 'Restores airflow', 'Improves efficiency'],
    price: '150',
    regularPrice: '150',
    discountedPrice: '150',
    duration: '1 hour'
  },
  {
    id: 'coil-clean',
    title: 'Coil Revitalization',
    icon: <Droplet className="w-8 h-8" />,
    benefits: ['Removes stubborn buildup', 'Prevents corrosion', 'Extends coil life'],
    price: '130',
    regularPrice: '130',
    discountedPrice: '130',
    duration: '1 hour'
  },
  {
    id: 'full-system',
    title: 'Complete System Wash',
    icon: <Settings className="w-8 h-8" />,
    benefits: ['Comprehensive cleaning', 'Includes all components', 'Full system optimization'],
    price: '180',
    regularPrice: '180',
    discountedPrice: '180',
    duration: '1 hour'
  },
  {
    id: 'mold-removal',
    title: 'Mold Elimination',
    icon: <Shield className="w-8 h-8" />,
    benefits: ['Kills mold spores', 'Prevents regrowth', 'Improves air quality'],
    price: '160',
    regularPrice: '160',
    discountedPrice: '160',
    duration: '1 hour'
  },
  {
    id: 'airflow-boost',
    title: 'Airflow Enhancement',
    icon: <Wind className="w-8 h-8" />,
    benefits: ['Increases airflow by 40%', 'Reduces energy costs', 'Improves comfort'],
    price: '140',
    regularPrice: '140',
    discountedPrice: '140',
    duration: '1 hour'
  },
  {
    id: 'temperature',
    title: 'Temperature Optimization',
    icon: <Thermometer className="w-8 h-8" />,
    benefits: ['Improves cooling efficiency', 'Reduces strain on system', 'Saves energy'],
    price: '150',
    regularPrice: '150',
    discountedPrice: '150',
    duration: '1 hour'
  },
  {
    id: 'quick-clean',
    title: 'Express Maintenance',
    icon: <Clock className="w-8 h-8" />,
    benefits: ['Quick system check', 'Basic cleaning', 'Performance assessment'],
    price: '100',
    regularPrice: '100',
    discountedPrice: '100',
    duration: '1 hour'
  },
  {
    id: 'premium',
    title: 'Premium Package',
    icon: <Star className="w-8 h-8" />,
    benefits: ['All services included', 'Priority scheduling', '1 year warranty'],
    price: '250',
    regularPrice: '250',
    discountedPrice: '250',
    duration: '1 hour',
    isPopular: true
  },
  {
    id: 'custom',
    title: 'Custom Solution',
    icon: <Settings className="w-8 h-8" />,
    benefits: ['Tailored to your needs', 'Flexible scheduling', 'Personalized service'],
    price: 'Custom Quote',
    regularPrice: '0',
    discountedPrice: '0',
    duration: 'Varies'
  }
];

const PowerJetChemWashHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoFocus = searchParams.get('autoFocus') === 'true';
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const [price] = useState(150);
  const [duration] = useState(90);

  useEffect(() => {
    if (autoFocus) {
      window.scrollTo(0, 0);
    }
  }, [autoFocus]);

  const handleBookNow = () => {
    toast.success('Booking confirmed for PowerJet Chemical Wash');
    console.log('Booking details:', {
      serviceType: 'powerjet-chemical',
      price: 150,
      duration: 90
    });
  };

  return (
    <div className="w-full bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-950 min-h-screen py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-20">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 md:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            PowerJet Chemical Wash
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            10x More Effective Than Traditional Cleaning Methods
          </motion.p>
          <motion.div 
            className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.p className="mb-3 md:mb-4">
            Our signature PowerJet service combines high-pressure cleaning with specialized coil chemicals to deeply clean and maintain your air conditioning system, ensuring optimal performance and energy efficiency.
            </motion.p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className={`relative rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm ${
                service.isPopular 
                  ? 'bg-gradient-to-br from-purple-900/80 to-blue-900/90 border-purple-700/50'
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-gray-700/50'
              } border`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Popular Badge */}
              {service.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl">
                  Most Popular
                </div>
              )}

              {/* Card Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    {service.icon}
                  </div>
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold text-blue-400"
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
                <div className="mt-6 flex flex-col items-center space-y-2">
                  <p className="text-base text-gray-400 line-through">
                    ${service.regularPrice}
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    ${service.discountedPrice}
                  </p>
                  <p className="text-sm text-gray-500">
                    {service.duration}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Features Section */}
        <div className="mt-20">
          <motion.h2 
            className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose PowerJet?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div 
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h3 
                className="text-xl font-bold text-blue-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Advanced Technology
              </motion.h3>
              <p className="text-gray-300">
                Our proprietary PowerJet system uses high-pressure, precision cleaning to remove even the most stubborn contaminants.
              </p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h3 
                className="text-xl font-bold text-blue-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Eco-Friendly
              </motion.h3>
              <p className="text-gray-300">
                We use biodegradable, non-toxic cleaning solutions that are safe for your family and the environment.
              </p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.h3 
                className="text-xl font-bold text-blue-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Guaranteed Results
              </motion.h3>
              <p className="text-gray-300">
                Backed by our 100% satisfaction guarantee and 1-year service warranty.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <motion.h2 
            className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl">
              <p className="text-gray-300 italic mb-4">
                "The PowerJet cleaning made my AC unit run like new! The technicians were professional and efficient."
              </p>
              <p className="text-gray-400">- Sarah L.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl">
              <p className="text-gray-300 italic mb-4">
                "I can't believe the difference in air quality after the cleaning. Highly recommend their services!"
              </p>
              <p className="text-gray-400">- Michael T.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerJetChemWashHome;
