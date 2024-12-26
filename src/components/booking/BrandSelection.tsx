/*
 * @AI_INSTRUCTION - DO NOT MODIFY THIS FILE
 * This component handles the air conditioner brand selection step and is considered stable.
 * 
 * Critical Features:
 * - Brand options display and selection
 * - Form validation
 * - Integration with booking flow
 * - Responsive grid layout
 * 
 * Any modifications could affect the brand selection experience.
 * If changes are needed:
 * 1. Test thoroughly with all brand options
 * 2. Ensure mobile responsiveness
 * 3. Validate integration with form state
 */

import React, { useState, memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Info, ArrowRight, ChevronDown, Loader2, X } from 'lucide-react';
import { OptimizedCard } from '@components/booking/components/OptimizedCard';
import { useScrollToTop } from '@hooks/useScrollToTop';
import { usePreloadComponents } from '@hooks/usePreloadComponents';
import styles from './BrandSelection.module.css';

interface BrandSelectionProps {
  onContinue: (brands: string[]) => void;
  error?: string;
  isLoading?: boolean;
}

interface BrandInfo {
  name: string;
  logo?: string;
}

const AC_BRANDS: BrandInfo[] = [
  { name: 'Daikin' },
  { name: 'Mitsubishi Electric' },
  { name: 'Panasonic' },
  { name: 'Haier' },
  { name: 'Fujitsu' },
  { name: 'Toshiba' },
  { name: 'Hitachi' },
  { name: 'Mixed Brands' }
];

const UNSUPPORTED_BRANDS = [
  'Avolta',
  'Beko',
  'Europace',
  'GREE',
  'LG',
  'McQuay',
  'Midea',
  'Mitsubishi Heavy Industries (MHI)',
  'PRISM+',
  'Samsung',
  'Sanyo',
  'Sharp',
  'TCL',
  'Trentios',
  'York'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const BrandSelection: React.FC<BrandSelectionProps> = memo(({ onContinue, error, isLoading }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | undefined>();
  const [isCompactView, setIsCompactView] = useState(false);
  const [fadeOutItems, setFadeOutItems] = useState(false);
  
  const scrollToTop = useScrollToTop([]);
  usePreloadComponents();

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let compactTimeout: NodeJS.Timeout;
    
    if (selectedBrands.length > 0) {
      fadeTimeout = setTimeout(() => {
        setFadeOutItems(true);
        
        compactTimeout = setTimeout(() => {
          setIsCompactView(true);
          setFadeOutItems(false);
        }, 500);
      }, 2000);
    } else {
      setFadeOutItems(false);
      setIsCompactView(false);
    }

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(compactTimeout);
    };
  }, [selectedBrands]);

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands(prev => {
      const newSelection = prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand];
      
      if (newSelection.length === 0) {
        setFadeOutItems(false);
        setIsCompactView(false);
      }
      
      return newSelection;
    });
    setValidationError(undefined);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedBrands.length === 0) {
      setValidationError('Please select at least one brand');
      return;
    }
    scrollToTop();
    onContinue(selectedBrands);
  }, [selectedBrands, onContinue, scrollToTop]);

  const renderBrandCard = useCallback((brand: BrandInfo) => (
    <motion.div
      key={brand.name}
      variants={itemVariants}
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: fadeOutItems ? (selectedBrands.includes(brand.name) ? 1 : 0) : 1,
        height: isCompactView ? (selectedBrands.includes(brand.name) ? 'auto' : 0) : 'auto'
      }}
      transition={{ 
        duration: 0.5,
        ease: "easeInOut",
        layout: { duration: 0.5 }
      }}
      layout
      style={{ 
        overflow: 'hidden',
        display: isCompactView && !selectedBrands.includes(brand.name) ? 'none' : 'block',
        width: '300px'
      }}
    >
      <OptimizedCard
        name={brand.name}
        logo={brand.logo}
        selected={selectedBrands.includes(brand.name)}
        onClick={() => handleBrandToggle(brand.name)}
        disabled={UNSUPPORTED_BRANDS.includes(brand.name)}
      />
    </motion.div>
  ), [selectedBrands, handleBrandToggle, isCompactView, fadeOutItems]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <div className={styles.notice}>
        <details className="group" open={selectedBrands.length === 0}>
          <summary className={styles.noticeSummary}>
            <div className={styles.noticeIcon}>
              <Info className={styles.noticeIconInner} />
            </div>
            <div className={styles.noticeContent}>
              <div className={styles.noticeHeader}>
                <h3 className={styles.noticeTitle}>Service Limitations</h3>
                <span className={styles.noticeBadge}>Important Notice</span>
              </div>
              <ChevronDown className={styles.noticeChevron} />
            </div>
          </summary>
          <div className={styles.noticeDetails}>
            <div className={styles.noticeList}>
              <p className={styles.noticeListTitle}>AC Types and Brands not serviced and repaired are:</p>
              <div className={styles.tagContainer}>
                {['Casement AC', 'Portable AC', 'Windows Type AC'].map((type) => (
                  <span key={type} className={styles.acTypeTag}>
                    {type}
                    <X className={styles.xIcon} />
                  </span>
                ))}
              </div>
              <div className={styles.tagContainer}>
                {UNSUPPORTED_BRANDS.map((brand) => (
                  <span key={brand} className={styles.brandTag}>
                    {brand}
                    <X className={styles.xIcon} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>

      <AnimatePresence mode="wait">
        {(error || validationError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.errorContainer}
          >
            <AlertTriangle className={styles.errorIcon} />
            <span className={styles.errorText}>{error || validationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className={`${styles.brandGrid} ${isCompactView ? styles.brandGridCentered : ''}`}>
          {AC_BRANDS.map(brand => renderBrandCard(brand))}
        </div>
      )}

      <div className={styles.buttonContainer}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={selectedBrands.length === 0}
          className={`${styles.button} ${
            selectedBrands.length > 0 ? styles.buttonEnabled : styles.buttonDisabled
          }`}
          style={{ willChange: 'transform' }}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
});

BrandSelection.displayName = 'BrandSelection';

export default BrandSelection;