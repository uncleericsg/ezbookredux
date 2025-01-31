/*
 * @ai-protection - DO NOT MODIFY THIS FILE
 * This is a stable version of the service limitations component that:
 * 1. Displays service restrictions and limitations
 * 2. Handles user acknowledgment
 * 3. Manages limitation visibility states
 * 
 * Critical Features:
 * - Dynamic limitation rendering
 * - User acknowledgment tracking
 * - Accessibility compliance
 * - Responsive design
 * 
 * Integration Points:
 * - Booking flow state management
 * - User interaction tracking
 * - Accessibility services
 * 
 * @ai-visual-protection: The limitations display must maintain consistent styling
 * @ai-flow-protection: The acknowledgment process must not be modified
 * @ai-state-protection: The visibility state management is optimized
 * 
 * Any modifications to this component could affect:
 * 1. User understanding of service limitations
 * 2. Legal compliance
 * 3. Booking flow progression
 * 4. Accessibility standards
 * 
 * If changes are needed:
 * 1. Verify legal compliance
 * 2. Test accessibility
 * 3. Validate user experience
 * 4. Update documentation
 */

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@components/atoms/Button';

interface ServiceLimitationsProps {
  onContinue: () => void;
  shouldClose?: boolean;
}

export const ServiceLimitations: React.FC<ServiceLimitationsProps> = ({ onContinue, shouldClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (shouldClose) {
      setIsOpen(false);
    }
  }, [shouldClose]);

  const limitations = [
    'Our services are currently available only in Singapore.',
    'We service residential air conditioners only (no commercial units).',
    'Maximum service height is up to 3 meters from the floor.',
    'Chemical cleaning services are not available for window/portable units.',
    'Additional charges may apply for special equipment requirements.',
  ];

  const handleAcknowledge = () => {
    onContinue();
  };

  return (
    <div className="service-limitations">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg font-medium text-white">Service Limitations</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 mt-2 bg-gray-800 rounded-lg space-y-4">
              <div className="limitations-container">
                {limitations.map((limitation, index) => (
                  <div
                    key={index}
                    className="limitation-item"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="limitation-content">
                      <span className="limitation-icon">⚠️</span>
                      <p className="limitation-text">{limitation}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Important Notice:</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium mb-2">Before booking our services:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Ensure easy access to your air conditioning units</li>
                    <li>Remove any valuable or fragile items from the service area</li>
                    <li>Inform us of any parking restrictions or special access requirements</li>
                    <li>Have your air conditioner's make and model information ready</li>
                  </ul>
                </div>
              </div>
              
              <div className="acknowledgment-section">
                <Button
                  onClick={handleAcknowledge}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition-colors"
                >
                  I Understand, Continue
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
