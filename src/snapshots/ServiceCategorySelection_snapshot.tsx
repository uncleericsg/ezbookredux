// Snapshot of ServiceCategorySelection.tsx as of 2024-12-12
// This file contains the complete design, layout, and component structure

import React, { useState, useEffect, useRef } from 'react';
import { 
  AirVent, Wrench, ShieldCheck, Star, Calendar, CheckCircle, 
  Shield, Clock, Timer, ThumbsUp, Users, BadgeCheck
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useServiceHistory } from '../hooks/useServiceHistory';
import { differenceInDays } from 'date-fns';
import { categoryMapper } from '../lib/categoryMapper';
import { useAcuitySettings } from '../hooks/useAcuitySettings';
import { toast } from 'sonner';
import { useNavigate } from '../hooks/useRouterTransition';
import { useServiceRating } from '../hooks/useServiceRating';
import ServiceRating from './ServiceRating';
import TrustIndicators from './TrustIndicators';
import { motion } from 'framer-motion';
import { BUSINESS_RULES } from '../constants';
import '../styles/home.css';
import CountUp from 'react-countup';

interface PricingTier {
  units: string;
  price: number;
  highlight?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number | null;
  icon: any;
  duration?: string;
  rating?: number;
  reviewCount?: number;
  popular?: boolean;
}

const ServiceCategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { submitRating } = useServiceRating();
  const { visits } = useServiceHistory(user?.id || '');
  const isAmcCustomer = user?.amcStatus === 'active';
  const completedVisits = visits.filter(v => v.status === 'completed').length;
  const [showRating, setShowRating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  const getDaysUntilService = () => {
    if (!user?.nextServiceDate) return null;
    const nextService = new Date(user.nextServiceDate);
    const today = new Date();
    const days = differenceInDays(nextService, today);
    return days > 0 ? days : null;
  };
  
  const daysUntilService = getDaysUntilService();

  const categories: ServiceCategory[] = [
    {
      id: 'regular',
      name: 'Regular Maintenance',
      description: 'Professional cleaning and maintenance service for your air conditioning units',
      type: 'maintenance',
      price: 60,
      icon: AirVent,
      duration: '1-2 hours',
      rating: 4.8,
      reviewCount: 1250,
      popular: true
    },
    {
      id: 'repair',
      name: 'Repair Service',
      description: 'Expert diagnosis and repair for any air conditioning problems',
      type: 'repair',
      price: 120,
      icon: Wrench,
      duration: '2-4 hours',
      rating: 4.9,
      reviewCount: 850
    },
    {
      id: 'gas-leak',
      name: 'Gas Leak Check & Troubleshooting',
      description: 'Comprehensive gas leak detection and system pressure testing service',
      type: 'diagnostic',
      price: 80,
      icon: ShieldCheck,
      duration: '1-3 hours',
      rating: 4.9,
      reviewCount: 680
    }
  ];

  // Dynamic category addition for AMC customers
  if (isAmcCustomer) {
    categories.unshift({
      id: 'amc',
      name: 'AMC Service Visit',
      description: 'Premium maintenance service included in your AMC package',
      type: 'amc',
      price: null,
      icon: ShieldCheck,
      duration: '1-2 hours',
      rating: 4.9,
      reviewCount: 320
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
  const handleCategorySelect = (categoryId: string, price: number | null) => {
    if (user) {
      const appointmentType = categoryMapper.getAppointmentTypeDetails(categoryId);
      if (!appointmentType) {
        toast.error('Invalid service type');
        return;
      }

      navigate('/schedule', { 
        state: { 
          categoryId, 
          price: appointmentType.price,
          duration: appointmentType.duration,
          isAmcService: categoryId === 'amc'
        }
      });
    } else {
      navigate('/booking', {
        state: { categoryId, price }
      });
    }
  };

  const handleRatingClick = () => {
    if (!user) {
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
    <div className="service-category-selection">
      {/* Header Section */}
      <div className="header-section">
        <h1>Professional Aircon Services</h1>
        <p className="subtitle">Choose from our range of expert services</p>
      </div>

      {/* Trust Indicators */}
      <TrustIndicators features={features} />

      {/* Service Categories Grid */}
      <div className="service-categories-grid">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className={`service-card ${category.popular ? 'popular' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategorySelect(category.id, category.price)}
          >
            {category.popular && <div className="popular-badge">Most Popular</div>}
            <div className="card-header">
              <category.icon className="category-icon" />
              <h3>{category.name}</h3>
            </div>
            <p className="description">{category.description}</p>
            <div className="service-details">
              {category.price !== null ? (
                <div className="price">From ${category.price}</div>
              ) : (
                <div className="price amc">AMC Package</div>
              )}
              {category.duration && (
                <div className="duration">
                  <Clock className="icon" />
                  {category.duration}
                </div>
              )}
              {category.rating && (
                <div className="rating">
                  <Star className="icon" />
                  {category.rating} ({category.reviewCount})
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="star-icon filled" />
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span className="testimonial-date">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rating Dialog */}
      {showRating && (
        <ServiceRating
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
};

export default ServiceCategorySelection;
