import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, Shield, Droplet, Settings, Wind, Thermometer, Clock, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const ChemWashServiceGrid = lazy(() => import('./components/ChemWashServiceGrid'));

// Original services data
const services = [
  {
    id: 'deep-clean',
    title: 'Deep System Clean',
    icon: <Zap className="w-8 h-8" />,
    benefits: ['Removes 99.9% contaminants', 'Restores airflow', 'Improves efficiency'],
    price: '$120-$150'
  },
  {
    id: 'coil-clean',
    title: 'Coil Revitalization',
    icon: <Droplet className="w-8 h-8" />,
    benefits: ['Removes stubborn buildup', 'Prevents corrosion', 'Extends coil life'],
    price: '$100-$130'
  },
  {
    id: 'full-system',
    title: 'Complete System Wash',
    icon: <Settings className="w-8 h-8" />,
    benefits: ['Comprehensive cleaning', 'Includes all components', 'Full system optimization'],
    price: '$150-$180'
  },
  {
    id: 'mold-removal',
    title: 'Mold Elimination',
    icon: <Shield className="w-8 h-8" />,
    benefits: ['Kills mold spores', 'Prevents regrowth', 'Improves air quality'],
    price: '$130-$160'
  },
  {
    id: 'airflow-boost',
    title: 'Airflow Enhancement',
    icon: <Wind className="w-8 h-8" />,
    benefits: ['Increases airflow by 40%', 'Reduces energy costs', 'Improves comfort'],
    price: '$110-$140'
  },
  {
    id: 'temperature',
    title: 'Temperature Optimization',
    icon: <Thermometer className="w-8 h-8" />,
    benefits: ['Improves cooling efficiency', 'Reduces strain on system', 'Saves energy'],
    price: '$120-$150'
  },
  {
    id: 'quick-clean',
    title: 'Express Maintenance',
    icon: <Clock className="w-8 h-8" />,
    benefits: ['Quick system check', 'Basic cleaning', 'Performance assessment'],
    price: '$80-$100'
  },
  {
    id: 'premium',
    title: 'Premium Package',
    icon: <Star className="w-8 h-8" />,
    benefits: ['All services included', 'Priority scheduling', '1 year warranty'],
    price: '$200-$250',
    isPopular: true
  }
];

const PowerJetChemWashHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoFocus = searchParams.get('autoFocus') === 'true';

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
              Our signature PowerJet service combines high-pressure cleaning with specialized coil chemicals to deeply clean and maintain your air conditioning system.
            </motion.p>
          </motion.div>
        </div>

        {/* Chemical Wash Packages Section */}
        <div className="mb-20">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Chemical Wash Packages
          </motion.h2>
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 animate-pulse"
                  >
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="h-10 bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ChemWashServiceGrid />
          </Suspense>
        </div>

        {/* Original Services Grid */}
        <div className="mt-20">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Additional Services
          </motion.h2>
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
                {service.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl">
                    Most Popular
                  </div>
                )}

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

                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <p className="text-xl font-semibold text-white">
                      {service.price}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
