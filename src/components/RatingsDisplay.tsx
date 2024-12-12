import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceRating from './ServiceRating';
import { useUser } from '../contexts/UserContext';
import { useServiceRating } from '../hooks/useServiceRating';
import { toast } from 'sonner';

interface Rating {
  id: string;
  userName: string;
  rating: number;
  date: string;
}

const DISPLAY_DURATION = 6000; // 6 seconds per rating
const MOCK_RATINGS: Rating[] = [
  { id: '1', userName: 'John L.', rating: 5, date: '2024-03-15' },
  { id: '2', userName: 'Sarah T.', rating: 5, date: '2024-03-14' },
  { id: '3', userName: 'Michael W.', rating: 4, date: '2024-03-13' },
  { id: '4', userName: 'Emma K.', rating: 5, date: '2024-03-12' },
  { id: '5', userName: 'David C.', rating: 5, date: '2024-03-11' },
  { id: '6', userName: 'Lisa M.', rating: 4, date: '2024-03-10' },
  { id: '7', userName: 'James P.', rating: 5, date: '2024-03-09' },
  { id: '8', userName: 'Anna S.', rating: 5, date: '2024-03-08' },
  { id: '9', userName: 'Robert Y.', rating: 4, date: '2024-03-07' },
  { id: '10', userName: 'Grace H.', rating: 5, date: '2024-03-06' },
];

const RatingsDisplay: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const { user } = useUser();
  const { submitRating } = useServiceRating();

  useEffect(() => {
    const loadRatings = async () => {
      try {
        // In development, use mock data
        if (import.meta.env.DEV) {
          // Shuffle the ratings array before filtering and slicing
          const shuffledRatings = [...MOCK_RATINGS]
            .sort(() => Math.random() - 0.5)
            .filter(r => r.rating >= 4)
            .slice(0, 10);
          setRatings(shuffledRatings);
          return;
        }

        const response = await fetch('/api/ratings/recent');
        const data = await response.json();
        // Shuffle the API response data before filtering and slicing
        const shuffledRatings = [...data]
          .sort(() => Math.random() - 0.5)
          .filter((r: Rating) => r.rating >= 4)
          .slice(0, 10);
        setRatings(shuffledRatings);
      } catch (error) {
        console.error('Failed to load ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      setCurrentIndex(prev => (prev + 1) % ratings.length);
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, [ratings.length, paused]);
  if (loading || ratings.length === 0) {
    return null;
  }

  const currentRating = ratings[currentIndex];

  const messages = [
    'just rated our service',
    'gave us a fantastic rating',
    'shared their experience',
    'rated our team',
    'appreciated our service'
  ];

  const message = messages[currentIndex % messages.length];

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
    
    // Prompt for Google review if rating is 4-5 stars
    if (rating >= 4) {
      const shouldReview = window.confirm(
        'Thank you for your positive feedback! Would you like to share your experience on Google?'
      );
      if (shouldReview) {
        window.open('https://rate.place/iaircon', '_blank');
      }
    }
  };

  return (
    <div className="h-20 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRating.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full space-y-2 cursor-pointer group px-4"
          onClick={handleRatingClick}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="text-center">
            <span className="font-medium text-gray-300">{currentRating.userName}</span>
            <span className="text-gray-400 ml-2">{message}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: currentRating.rating }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Star
                  className="h-6 w-6 text-yellow-400 fill-yellow-400 transition-all duration-300 group-hover:scale-110"
                />
              </motion.div>
            ))}
            <MessageSquare className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
          </div>
        </motion.div>
      </AnimatePresence>
      
      {showRating && (
        <ServiceRating
          serviceId="latest-service"
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
};

export default RatingsDisplay;