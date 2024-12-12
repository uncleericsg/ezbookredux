import React from 'react';
import { Calendar, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button 
        onClick={() => navigate('/')} 
        className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-4 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-blue-500/20"></div>
        <div className="relative flex items-center justify-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-white group-hover:translate-x-1 transition-transform duration-300">Schedule Service</span>
        </div>
      </button>

      <button 
        onClick={() => navigate('/amc-packages')}
        className="relative bg-gray-800/30 backdrop-blur-md backdrop-saturate-150 rounded-lg p-4 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-300 ease-in-out group-hover:from-amber-500/20"></div>
        <div className="relative flex items-center justify-center space-x-2">
          <ArrowUp className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-white group-hover:translate-x-1 transition-transform duration-300">AMC Upgrade</span>
        </div>
      </button>
    </div>
  );
};

export default QuickActions;
