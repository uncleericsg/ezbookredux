import React from 'react';
import type { UserViewType } from './AdminViewToggle';

interface ViewSelectorProps {
  currentView: UserViewType;
  onViewChange: (view: UserViewType) => void;
  onClose: () => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange, onClose }) => {
  const options = [
    {
      type: 'non-user' as const,
      label: 'Non-User View',
      description: 'View as a non-logged in user',
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      hoverColor: 'hover:bg-gray-700'
    },
    {
      type: 'regular' as const,
      label: 'Regular User',
      description: 'View as a logged-in user',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      type: 'amc' as const,
      label: 'AMC User',
      description: 'View as an AMC subscriber',
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      hoverColor: 'hover:bg-green-500'
    },
    {
      type: 'admin' as const,
      label: 'Admin User',
      description: 'View as an administrator',
      bgColor: 'bg-purple-600',
      textColor: 'text-white',
      hoverColor: 'hover:bg-purple-500'
    }
  ];

  const handleViewChange = (type: UserViewType) => {
    onViewChange(type);
    // Add a small delay before closing to ensure the view change is processed
    setTimeout(onClose, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-96 max-w-[90vw] border border-gray-700">
        <h2 className="text-xl font-bold mb-2">Select View Mode</h2>
        <p className="text-gray-400 text-sm mb-4">Choose which user view to simulate</p>
        <div className="space-y-3">
          {options.map(({ type, label, description, bgColor, textColor, hoverColor }) => (
            <button
              key={type}
              onClick={() => handleViewChange(type)}
              className={`w-full p-4 rounded-lg transition-all duration-200 ${bgColor} ${textColor} ${hoverColor} 
                ${currentView === type ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-gray-900' : ''}`}
            >
              <div className="text-left">
                <div className="font-semibold">{label}</div>
                <div className="text-sm opacity-80">{description}</div>
              </div>
              {currentView === type && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="bg-white/20 rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewSelector;
