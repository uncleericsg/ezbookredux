import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Users, Bell, Shield, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { toast } from 'sonner';

interface Action {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  requiresAdmin?: boolean;
}

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const actions: Action[] = [
    {
      icon: Shield,
      label: 'Admin Dashboard',
      onClick: () => {
        if (!isAdmin) {
          toast.error('Admin access required');
          return;
        }
        navigate('/admin');
        setIsOpen(false);
      },
      requiresAdmin: true
    },
    {
      icon: Users,
      label: 'User Management',
      onClick: () => {
        if (!isAdmin) {
          toast.error('Admin access required');
          return;
        }
        navigate('/admin/users');
        setIsOpen(false);
      },
      requiresAdmin: true
    },
    {
      icon: Settings,
      label: 'Admin Settings',
      onClick: () => {
        if (!isAdmin) {
          toast.error('Admin access required');
          return;
        }
        navigate('/admin/settings');
        setIsOpen(false);
      },
      requiresAdmin: true
    }
  ];

  // Filter actions based on user role
  const visibleActions = actions.filter(action => !action.requiresAdmin || isAdmin);

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
            {visibleActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.onClick}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 shadow-lg min-w-[160px] group"
              >
                <action.icon className="h-5 w-5 text-[#FFD700] group-hover:text-yellow-400" />
                <span className="text-sm">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg ${
          isAdmin 
            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
            : 'bg-gradient-to-r from-[#FFD700] to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
        }`}
      >
        {isOpen ? (
          <MoreVertical className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

// Add display name
FloatingActionButton.displayName = 'FloatingActionButton';

// Export both named and default
export { FloatingActionButton };
export default FloatingActionButton;