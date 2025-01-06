import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAppSelector } from '@store';
import ServiceRating from '@components/ServiceRating';
import { useServiceRating } from '@hooks/useServiceRating';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
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
];

const TestimonialsSection: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const { submitRating } = useServiceRating();
  const [showRating, setShowRating] = useState(false);
  const [shuffledTestimonials, setShuffledTestimonials] = useState<Testimonial[]>([]);

  const shuffleArray = useCallback((array: Testimonial[]): Testimonial[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  useEffect(() => {
    setShuffledTestimonials(shuffleArray(testimonials));
  }, [shuffleArray]);

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
  };

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden w-full py-4">
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              background: 'linear-gradient(90deg, rgba(17,24,39,1) 0%, rgba(17,24,39,0) 5%, rgba(17,24,39,0) 95%, rgba(17,24,39,1) 100%)' 
            }}
          />
          <motion.div
            className="flex px-4"
            initial={{ x: '0%' }}
            animate={{ x: '-66.666%' }}
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

      {showRating && (
        <ServiceRating
          serviceId="latest-service"
          onClose={() => setShowRating(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default TestimonialsSection;