import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsSectionProps {
  id: string;
  title: string;
  icon: JSX.Element;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  icon,
  expanded,
  onToggle,
  children
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-6 focus:outline-none"
        aria-expanded={expanded}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center space-x-3">
          {React.cloneElement(icon, { className: 'text-blue-400 h-6 w-6' })}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`section-${id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsSection;