import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Users, Bell, Shield, MoreVertical } from 'lucide-react';

interface Action {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions: Action[] = [
    {
      icon: Users,
      label: 'Add User',
      onClick: () => {
        // Handle add user
        setIsOpen(false);
      }
    },
    {
      icon: Bell,
      label: 'New Notification',
      onClick: () => {
        // Handle new notification
        setIsOpen(false);
      }
    },
    {
      icon: Shield,
      label: 'AMC Package',
      onClick: () => {
        // Handle AMC package
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 mb-4 space-y-2"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={action.onClick}
                  className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors min-w-[160px]"
                >
                  <Icon className="h-5 w-5" />
                  <span>{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center"
        style={{ 
          width: '56px', 
          height: '56px',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {isOpen ? (
          <MoreVertical className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;