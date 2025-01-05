import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { useAppSelector } from '@store';
import { AirVent, Wrench, ShieldCheck } from 'lucide-react';
import CategoryCard from '../features/CategoryCard';
import { ROUTES } from '@config/routes';

interface CategoryGridProps {
  className?: string;
}

/**
 * CategoryGrid Component
 * Displays a grid of service categories with dynamic ordering based on user type
 */
const CategoryGrid: React.FC<CategoryGridProps> = ({ className }) => {
  const navigate = useNavigate();
  const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { currentUser } = useAppSelector(state => state.user);
  const isAmcCustomer = currentUser?.amcStatus === 'active';

  // Memoize categories to prevent unnecessary recalculations
  const categories = useMemo(() => {
    const baseCategories = [
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
    
    // Add AMC category for AMC customers
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

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    window.scrollTo(0, 0);
    const selectedCategory = categories.find(c => c.id === categoryId)?.name || '';
    const state = {
      from: '/',
      timestamp: Date.now(),
      selectedCategory
    };
    
    // Route mapping
    type CategoryRoutes = {
      [key: string]: string;
      regular: string;
      'powerjet-chemical': string;
      'gas-leak': string;
      default: string;
    };

    const routes: CategoryRoutes = {
      regular: ROUTES.BOOKING.RETURN_CUSTOMER,
      'powerjet-chemical': ROUTES.BOOKING.POWERJET_CHEMICAL,
      'gas-leak': ROUTES.BOOKING.GAS_LEAK,
      default: ROUTES.PRICING
    };
    
    const route = routes[categoryId as keyof typeof routes] || routes.default;
    navigate(route, { state });
  };

  return (
    <motion.div 
      className={`mb-24 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={() => handleCategorySelect(category.id)}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryGrid;