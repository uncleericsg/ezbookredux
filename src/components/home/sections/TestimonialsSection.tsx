import React from 'react';
import { motion } from 'framer-motion';
import RatingsDisplay from '../features/RatingsDisplay';

interface TestimonialsSectionProps {
  className?: string;
}

/**
 * TestimonialsSection Component
 * Displays customer testimonials in an animated section
 */
const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className }) => {
  return (
    <div className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-[#FFD700] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-300">
            Join thousands of satisfied customers who trust our services
          </p>
        </motion.div>

        {/* Testimonials Display */}
        <div className="relative overflow-hidden w-full py-4">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              background: 'linear-gradient(90deg, rgba(17,24,39,1) 0%, rgba(17,24,39,0) 5%, rgba(17,24,39,0) 95%, rgba(17,24,39,1) 100%)' 
            }}
          />

          {/* Ratings Display */}
          <RatingsDisplay />
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-400 text-sm">
            Click on any rating to share your own experience
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsSection;