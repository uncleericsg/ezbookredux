import React from 'react';
import type { QuickActionButtonProps } from '@/types/quick-actions';

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  gradientFrom,
  iconColor
}) => {
  return (
    <button 
      onClick={onClick}
      className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-4 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-${gradientFrom}/20`}></div>
      <div className="relative flex items-center justify-center space-x-2">
        <Icon className={`h-5 w-5 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
        <span className="text-white group-hover:translate-x-1 transition-transform duration-300">{label}</span>
      </div>
    </button>
  );
};

export default QuickActionButton;