import React, { useState, useEffect, useRef } from 'react';
import { 
  AirVent, Wrench, ShieldCheck, Star, Calendar, CheckCircle, 
  Shield, Clock, Timer, ThumbsUp, Users, BadgeCheck
} from 'lucide-react';
import { useAppSelector } from '../store';
import { useServiceHistory } from '../hooks/useServiceHistory';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from '../hooks/useRouterTransition';
import { useServiceRating } from '../hooks/useServiceRating';
import ServiceRating from './ServiceRating';
import TrustIndicators from './TrustIndicators';
import { motion } from 'framer-motion';
import { BUSINESS_RULES } from '../constants/businessRules';
import '../styles/home.css';
import CountUp from 'react-countup';
import styles from './ServiceCategorySelection.module.css';
import FloatingButtons from './FloatingButtons';
import type { ServiceCategory } from '../types';

const ServiceCategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);
  const { submitRating } = useServiceRating();
  const { visits } = useServiceHistory(currentUser?.id || '');
  const isAmcCustomer = currentUser?.amcStatus === 'active';
  const completedVisits = visits.filter(v => v.status === 'completed').length;
  const [showRating, setShowRating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  const getDaysUntilService = () => {
    if (!currentUser?.nextServiceDate) return null;
    const nextService = new Date(currentUser.nextServiceDate);
    const today = new Date();
    const days = differenceInDays(nextService, today);
    return days > 0 ? days : null;
  };
  
  const daysUntilService = getDaysUntilService();

  const categories: ServiceCategory[] = [
    {
      id: 'regular',
      name: 'Return Customers Booking',
      description: 'Quick and easy booking for our valued returning customers',
      type: 'maintenance',
      price: 60,
      icon: AirVent,
      duration: 60,
      rating: 4.8,
      reviewCount: 1250,
      visible: true,
      order: 1,
      popular: true
    },
    {
      id: 'repair',
      name: 'Repair Service',
      description: 'Expert diagnosis and repair for any air conditioning problems',
      type: 'repair',
      price: 120,
      icon: Wrench,
      duration: 120,
      rating: 4.9,
      reviewCount: 850,
      visible: true,
      order: 2
    },
    {
      id: 'gas-leak',
      name: 'Gas Leak Check & Troubleshooting',
      description: 'Comprehensive gas leak detection and system pressure testing service',
      type: 'diagnostic',
      price: 80,
      icon: ShieldCheck,
      duration: 90,
      rating: 4.9,
      reviewCount: 680,
      visible: true,
      order: 3
    }
  ];

  if (isAmcCustomer) {
    categories.unshift({
      id: 'amc',
      name: 'AMC Service Visit',
      description: 'Premium maintenance service included in your AMC package',
      type: 'amc',
      price: null,
      icon: ShieldCheck,
      duration: 90,
      rating: 4.9,
      reviewCount: 320,
      visible: true,
      order: 0
    });
  }

  const features = [
    { icon: CheckCircle, text: 'Professional Service' },
    { icon: Users, text: 'Expert Technicians' },
    { icon: BadgeCheck, text: 'Quality Guarantee' },
    { icon: Timer, text: 'Fast Response' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      rating: 5,
      text: 'Excellent service! The technician was professional and thorough. My aircon has never worked better.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Michael Tan',
      rating: 5,
      text: 'Very satisfied with the chemical wash service. The team was punctual and efficient.',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'David Lim',
      rating: 5,
      text: 'Great experience from booking to service completion. Will definitely use again!',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'Lisa Wong',
      rating: 5,
      text: 'Professional team and competitive pricing. My go-to aircon service provider now.',
      date: '2 months ago'
    }
  ];

  // Event handlers and business logic
  const handleCategorySelect = (categoryId: string, price: number | null, duration: number, isAmcService: boolean) => {
    if (!categoryId || (!price && !isAmcService) || !duration) {
      toast.error('Invalid service type selected');
      return;
    }
    
    navigate('/service-pricing', { 
      state: { 
        categoryId, 
        price: price || 0, // Use 0 for AMC service
        duration,
        isAmcService 
      } 
    });
  };

  const handleRatingClick = () => {
    if (!currentUser) {
      toast.error('Please log in to rate our service');
      return;
    }
    setShowRating(true);
  };

  const handleRatingSubmit = async (rating: number, feedback?: string) => {
    await submitRating('latest-service', rating, feedback);
    setShowRating(false);
    
    if (rating >= 4) {
      const shouldReview = window.confirm(
        'Thank you for your positive feedback! Would you like to share your experience on Google?'
      );
      if (shouldReview) {
        window.open('https://rate.place/iaircon', '_blank');
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div className={`${styles.serviceCategoryContainer} min-h-screen bg-gray-900 text-white relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Categories Design */}
        <div className="mb-24">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700]">
              iAircon
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Singapore's No.1 PowerJet Experts
            </p>
          </div>
          
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
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FFD700] blur-sm opacity-50"></div>
                      <div className="relative bg-[#FFD700] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}
                
                <motion.button
                  onClick={() => handleCategorySelect(category.id, category.price, category.duration, category.type === 'amc')}
                  className="w-full h-full bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-[#FFD700]/30 transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/5 flex flex-col"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon && <category.icon className="h-8 w-8 text-[#FFD700]" />}
                    </div>
                    {category.type === 'amc' && (
                      <span className="ml-auto bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] px-4 py-2 rounded-lg text-sm font-medium">
                        AMC Package
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-[#FFD700] mb-3 group-hover:text-[#FFD700] transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  {category.rating && (
                    <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-gray-700/50">
                      <Star className="h-4 w-4 text-[#FFD700]" />
                      <span className="text-sm text-gray-300">
                        {category.rating} ({category.reviewCount}+ reviews)
                      </span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AMC Cards */}
        {isAmcCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6 md:p-8 border border-blue-500/20 mt-8 mb-24"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#FFD700]">AMC Service Progress</h2>
                  <button
                    onClick={() => navigate('/schedule', { 
                      state: { 
                        categoryId: 'amc', 
                        isAmcService: true 
                      }
                    })}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Now</span>
                  </button>
                </div>
                <p className="text-gray-300 mb-4">
                  Track your maintenance visits and service history
                </p>
                
                <div className="bg-gray-700/50 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-600 pb-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                      <span>Service Visits</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1 mr-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full ${
                              i < completedVisits
                                ? 'bg-blue-500'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{completedVisits}/4</span>
                    </div>
                  </div>
                  {currentUser?.lastServiceDate && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <span>Last Service</span>
                      </div>
                      <span className="font-medium">
                        {new Date(currentUser.lastServiceDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {currentUser?.nextServiceDate && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <span>Next Service</span>
                      </div>
                      <span className="font-medium">
                        {new Date(currentUser.nextServiceDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {completedVisits >= 3 && (
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      {completedVisits === 3
                        ? 'Your next service will be your final AMC visit. Please renew your package to continue enjoying AMC benefits.'
                        : 'This is your final AMC visit. Renew now to maintain continuous coverage.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Trust Indicators Section */}
        <div className="mt-24 mb-24">
          <TrustIndicators />
        </div>

        {/* Testimonials Section */}
        <div className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group"
                  onClick={handleRatingClick}
                >
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-7 h-7 text-yellow-400 fill-yellow-400 transition-transform group-hover:scale-110"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 text-center">{testimonial.text}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-400">{testimonial.name}</span>
                    <span className="text-gray-500">{testimonial.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showRating && (
          <ServiceRating
            onClose={() => setShowRating(false)}
            onSubmit={handleRatingSubmit}
            serviceId="latest-service"
          />
        )}
      </div>
      <FloatingButtons />
      {showRating && (
        <ServiceRating 
          onSubmit={handleRatingSubmit} 
          onClose={() => setShowRating(false)} 
          serviceId="latest-service"
        />
      )}
    </div>
  );
};

export default ServiceCategorySelection;