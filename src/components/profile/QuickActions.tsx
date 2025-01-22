import React from 'react';
import { Calendar, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { QuickActionsProps } from '@/types/quick-actions';
import QuickActionButton from './QuickActionButton';

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Calendar,
      label: 'Schedule Service',
      onClick: () => navigate('/'),
      gradientFrom: 'blue-500',
      iconColor: 'text-blue-400'
    },
    {
      icon: ArrowUpCircle,
      label: 'AMC Upgrade',
      onClick: () => navigate('/amc-packages'),
      gradientFrom: 'amber-500',
      iconColor: 'text-amber-400'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className || ''}`}>
      {actions.map((action, index) => (
        <QuickActionButton key={index} {...action} />
      ))}
    </div>
  );
};

export default QuickActions;
