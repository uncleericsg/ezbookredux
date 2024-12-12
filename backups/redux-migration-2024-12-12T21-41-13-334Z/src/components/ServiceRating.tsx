import React, { useState, useRef, useEffect } from 'react';
import { Star, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import RatingConfirmationModal from './RatingConfirmationModal';

interface ServiceRatingProps {
  serviceId: string;
  onSubmit: (rating: number, feedback: string) => Promise<void>;
  onClose: () => void;
}

const ServiceRating: React.FC<ServiceRatingProps> = ({ serviceId, onSubmit, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    let redirectTimeout: NodeJS.Timeout;

    try {
      await onSubmit(rating, feedback);
      setSubmitted(true);
      
      if (rating >= 4 && rating <= 5) {
        setShowConfirmation(true);
      }
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setLoading(false);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  };

  const handleGoogleReview = () => {
    window.open('https://rate.place/iaircon', '_blank');
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm px-4"
    >
      <RatingConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleGoogleReview}
      />

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gray-800/95 backdrop-blur-md rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="rating-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Rate Our Service</h2>
                <p className="text-gray-400">
                  How would you rate your recent service experience?
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(value)}
                      className="p-1.5 transition-all"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          value <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-500'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-300">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about our service (optional)"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl p-3 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <span>Submit Rating</span>
                      {rating >= 4 && <Star className="w-4 h-4" />}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-4 py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-semibold">Thank You!</h2>
              <p className="text-gray-400">
                We truly appreciate your valuable feedback.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ServiceRating;