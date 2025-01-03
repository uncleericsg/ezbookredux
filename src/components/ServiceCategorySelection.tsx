import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  AirVent, Wrench, ShieldCheck, Star, Calendar, CheckCircle, 
  Shield, Clock, Timer, Users, BadgeCheck
} from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@config/routes';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useServiceHistory } from '@hooks/useServiceHistory';
import { useServiceRating } from '@hooks/useServiceRating';

import { useAppSelector } from '../store/hooks';
import { type RootState } from '../store/store';

import ServiceCategoryCard from './ServiceCategoryCard';

const TrustIndicators = lazy(() => import('@components/TrustIndicators'));
const ServiceRating = lazy(() => import('@components/ServiceRating'));
const FloatingButtons = lazy(() => import('@components/FloatingButtons'));

import styles from './ServiceCategorySelection.module.css';

interface ServiceCategory {
  id: string;            // Category identifier
  name: string;          // Display name
  description: string;   // Category description
  icon: any;            // Icon component
  rating?: number;       // Optional rating
  reviewCount?: number;  // Optional review count
  popular?: boolean;     // Optional popular flag
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface NavigationState {
  from: string;
  timestamp: number;
  selectedCategory: string;
}

const ServiceCategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  const { visits } = useServiceHistory(currentUser?.id || '');
  const isAmcCustomer = currentUser?.amcStatus === 'active';
  const { submitRating } = useServiceRating();
  const [showRating, setShowRating] = useState(false);
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [shuffledTestimonials, setShuffledTestimonials] = useState<Testimonial[]>([]);
  const location = useLocation();

  // Memoize categories as per enhancement plan
  const categories = useMemo(() => {
    const baseCategories: ServiceCategory[] = [
      {
        id: 'regular',
        name: 'Return Customers Booking',
        description: 'Quick and easy booking for our valued returning customers',
        icon: AirVent,
        rating: 4.8,
        reviewCount: 1250,
        popular: true
      },
      {
        id: 'powerjet-chemical',
        name: 'PowerJet Chemical Wash',
        description: 'Signature powerjet service with deep cleaning using coil chemicals',
        icon: Wrench,
        rating: 4.9,
        reviewCount: 850
      },
      {
        id: 'gas-leak',
        name: 'Gas Check & Leakage Issues',
        description: 'Frequent gas top-up & leakage issues inspection service',
        icon: ShieldCheck,
        rating: 4.9,
        reviewCount: 680
      }
    ];
    
    if (isAmcCustomer) {
      baseCategories.unshift({
        id: 'amc',
        name: 'AMC Service Visit',
        description: 'Premium maintenance service included in your AMC package',
        icon: ShieldCheck,
        rating: 4.9,
        reviewCount: 320
      });
    }
    
    return baseCategories;
  }, [isAmcCustomer]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    console.log('Selected category:', categoryId);
    window.scrollTo(0, 0);
    const selectedCategory = categories.find(c => c.id === categoryId)?.name || '';
    const state: NavigationState = {
      from: '/',
      timestamp: Date.now(),
      selectedCategory
    };
    
    if (categoryId === 'regular') {
      navigate(ROUTES.BOOKING.RETURN_CUSTOMER, { state });
    } else if (categoryId === 'powerjet-chemical') {
      navigate(ROUTES.BOOKING.POWERJET_CHEMICAL, { state });
    } else if (categoryId === 'gas-leak') {
      navigate(ROUTES.BOOKING.GAS_LEAK, { state });
    } else {
      navigate(ROUTES.PRICING, { state });
    }
  }, [navigate, categories]);

  const handleRatingClick = () => {
    if (!currentUser) {
      toast.error('Please log in to rate our service');
      return;
    }
    setShowRating(true);
  };

  const handleRatingSubmit = useCallback(async (rating: number, feedback?: string) => {
    await submitRating('latest-service', rating, feedback);
    setShowRating(false);
  }, [submitRating]);

  const shuffleArray = useCallback((array: Testimonial[]): Testimonial[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const testimonials = useMemo((): Testimonial[] => [
    {
      id: 1,
      name: 'Sarah Chen',
      rating: 5,
      text: 'Excellent service! The technician was professional and thorough.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Michael Tan',
      rating: 5,
      text: 'Very satisfied with the chemical wash service. Highly recommended!',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'David Lim',
      rating: 5,
      text: 'The AMC service is worth every penny. Regular maintenance keeps my aircon running perfectly.',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'Jessica Wong',
      rating: 5,
      text: 'Quick response time and great attention to detail. My go-to aircon service!',
      date: '2 days ago'
    }
  ], []);

  useEffect(() => {
    setShuffledTestimonials(shuffleArray(testimonials));
  }, [shuffleArray, testimonials]);

  useEffect(() => {
    return () => {
      console.log('ServiceCategorySelection unmounted');
    };
  }, []);

  return (
    <div className={`${styles.serviceCategoryContainer} min-h-screen bg-gray-900 text-white relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Categories Design */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to iAircon
            </motion.h2>
            <motion.p 
              className="text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              No.1 PowerJet Experts in Singapore!
            </motion.p>
          </motion.div>
          
          {/* Service Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className="relative group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {category.popular && (
                  <motion.div
                    className="absolute -top-3 -right-3 z-10"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 1.5
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FFD700] blur-sm opacity-50"></div>
                      <div className="relative bg-[#FFD700] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                        Most Popular
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <motion.button
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full h-full backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 shadow-lg flex flex-col ${
                    category.id === 'regular'
                      ? 'bg-gradient-to-br from-amber-600/50 to-[#1a365d]/70 border-amber-500/50 hover:border-amber-400/70 hover:shadow-amber-500/30'
                    : category.id === 'powerjet-chemical'
                      ? 'bg-gradient-to-br from-blue-500/50 to-cyan-900/70 border-cyan-400/50 hover:border-cyan-300/70 hover:shadow-cyan-400/30'
                    : category.id === 'gas-leak'
                      ? 'bg-gradient-to-br from-red-500/50 to-purple-900/70 border-red-400/50 hover:border-red-300/70 hover:shadow-red-400/30'
                    : category.id === 'amc'
                      ? 'bg-gradient-to-br from-[#FFD700]/60 to-blue-900/70 border-[#FFD700]/50 hover:border-[#FFD700]/70 hover:shadow-[#FFD700]/30'
                    : 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50 hover:border-[#FFD700]/30 hover:shadow-[#FFD700]/5'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm ${
                      category.id === 'regular'
                        ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/10 shadow-lg shadow-amber-500/20'
                      : category.id === 'powerjet-chemical'
                        ? 'bg-gradient-to-br from-blue-400/30 to-cyan-500/10 shadow-lg shadow-cyan-400/20'
                      : category.id === 'gas-leak'
                        ? 'bg-gradient-to-br from-red-400/30 to-purple-500/10 shadow-lg shadow-red-400/20'
                      : category.id === 'amc'
                        ? 'bg-gradient-to-br from-[#FFD700]/30 to-blue-500/10 shadow-lg shadow-[#FFD700]/20'
                      : 'bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5'
                    }`}>
                      <category.icon className={`h-8 w-8 filter drop-shadow-lg ${
                        category.id === 'regular'
                          ? 'text-amber-400 drop-shadow-[0_0_0.3rem_#f59e0b]'
                        : category.id === 'powerjet-chemical'
                          ? 'text-cyan-300 drop-shadow-[0_0_0.3rem_#22d3ee]'
                        : category.id === 'gas-leak'
                          ? 'text-red-400 drop-shadow-[0_0_0.3rem_#f87171]'
                        : category.id === 'amc'
                          ? 'text-[#FFD700] drop-shadow-[0_0_0.3rem_#FFD700]'
                        : 'text-[#FFD700]'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className={`text-xl font-bold mb-3 transition-colors tracking-wide ${
                      category.id === 'regular'
                        ? 'text-amber-300 drop-shadow-[0_0_0.2rem_#f59e0b]'
                      : category.id === 'powerjet-chemical'
                        ? 'text-cyan-200 drop-shadow-[0_0_0.2rem_#22d3ee]'
                      : category.id === 'gas-leak'
                        ? 'text-red-300 drop-shadow-[0_0_0.2rem_#f87171]'
                      : category.id === 'amc'
                        ? 'text-[#FFD700] drop-shadow-[0_0_0.2rem_#FFD700]'
                      : 'text-[#FFD700]'
                    }`}>
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  {category.rating && (
                    <div className={`flex items-center space-x-2 mt-6 pt-6 border-t ${
                      category.id === 'regular'
                        ? 'border-yellow-700/50'
                      : category.id === 'powerjet-chemical'
                        ? 'border-cyan-700/50'
                      : category.id === 'gas-leak'
                        ? 'border-pink-700/50'
                      : category.id === 'amc'
                        ? 'border-[#FFD700]/50'
                      : 'border-gray-700/50'
                    }`}>
                      <Star className={`h-4 w-4 ${
                        category.id === 'regular'
                          ? 'text-yellow-400'
                        : category.id === 'powerjet-chemical'
                          ? 'text-cyan-400'
                        : category.id === 'gas-leak'
                          ? 'text-pink-400'
                        : category.id === 'amc'
                          ? 'text-[#FFD700]'
                        : 'text-[#FFD700]'
                      }`} />
                      <span className="text-sm text-gray-300">
                        {category.rating} ({category.reviewCount}+ reviews)
                      </span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators Section */}
        <div className="mt-36 mb-24">
          <TrustIndicators />
        </div>

        {/* Testimonials Section */}
        <div className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden w-full py-4">
              <div className="absolute inset-0 pointer-events-none" style={{ 
                background: 'linear-gradient(90deg, rgba(17,24,39,1) 0%, rgba(17,24,39,0) 5%, rgba(17,24,39,0) 95%, rgba(17,24,39,1) 100%)' 
              }}></div>
              <motion.div
                className="flex px-4"
                initial={{ x: '0%' }}
                animate={{
                  x: '-66.666%'
                }}
                transition={{
                  duration: 80,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: "loop"
                }}
                style={{
                  width: '300%',
                  display: 'flex',
                  gap: '1rem'
                }}
              >
                {[...shuffledTestimonials, ...shuffledTestimonials, ...shuffledTestimonials].map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.id}-${index}`}
                    className="w-full min-w-[280px] md:w-[320px] lg:w-[300px] px-2 py-2"
                    whileHover={{ scale: 1.05, zIndex: 1 }}
                  >
                    <div
                      className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group h-[200px] flex flex-col justify-between"
                      onClick={handleRatingClick}
                    >
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-yellow-400 transition-transform group-hover:scale-110"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-300 mb-2 text-center text-sm line-clamp-3">{testimonial.text}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-400">{testimonial.name}</span>
                        <span className="text-gray-500">{testimonial.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div>
          <FloatingButtons />
          
          {showRating && (
            <ServiceRating
              serviceId="latest-service"
              onClose={() => setShowRating(false)}
              onSubmit={handleRatingSubmit}
            />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ServiceCategorySelection;
