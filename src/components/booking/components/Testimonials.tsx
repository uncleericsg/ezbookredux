import { motion } from 'framer-motion';
import { ChemWashTestimonial } from '../types/chemwashserviceTypes';

interface TestimonialsProps {
  testimonials?: ChemWashTestimonial[];
}

const defaultTestimonials: ChemWashTestimonial[] = [
  {
    quote: "The PowerJet cleaning made my AC unit run like new! The technicians were professional and efficient.",
    author: "Sarah L."
  },
  {
    quote: "I can't believe the difference in air quality after the cleaning. Highly recommend their services!",
    author: "Michael T."
  }
];

const Testimonials = ({ testimonials = defaultTestimonials }: TestimonialsProps) => {
  return (
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
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index}
            className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2 + (index * 0.1),
              type: "spring",
              stiffness: 100
            }}
          >
            <p className="text-gray-300 italic mb-4">
              "{testimonial.quote}"
            </p>
            <p className="text-gray-400">- {testimonial.author}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;