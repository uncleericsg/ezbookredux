import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import ConfirmDialog from '@admin/ConfirmDialog';

interface UserStatusToggleProps {
  userId: string;
  isActive: boolean;
  onToggle: (userId: string, newStatus: boolean) => Promise<void>;
}

const UserStatusToggle: React.FC<UserStatusToggleProps> = ({
  userId,
  isActive,
  onToggle
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  const handleToggleClick = () => {
    setPendingStatus(!isActive);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (pendingStatus === null) return;
    
    try {
      setLoading(true);
      await onToggle(userId, pendingStatus);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setPendingStatus(null);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      <button
        onClick={handleToggleClick}
        disabled={loading}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        style={{
          backgroundColor: isActive ? '#10B981' : '#6B7280'
        }}
      >
        <span className="sr-only">
          {isActive ? 'Deactivate user' : 'Activate user'}
        </span>
        
        <motion.span
          layout
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          animate={{
            x: isActive ? '24px' : '4px'
          }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
        )}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title={pendingStatus ? 'Activate User' : 'Deactivate User'}
        message={pendingStatus 
          ? 'Are you sure you want to activate this user? They will regain access to all features.'
          : 'Are you sure you want to deactivate this user? They will lose access to all features.'
        }
        confirmLabel={pendingStatus ? 'Activate' : 'Deactivate'}
        isDestructive={!pendingStatus}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default UserStatusToggle;