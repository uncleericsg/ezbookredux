import React from 'react';
import { FiHome, FiBox } from 'react-icons/fi';
import type { OptionalSectionProps } from '../types';

const OptionalSection: React.FC<OptionalSectionProps> = ({
  formData,
  validation,
  onInputChange,
  onBlur
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative">
        <label htmlFor="buildingName" className="block text-sm font-medium text-gray-200 mb-2">
          Condo Name (Optional)
        </label>
        <div className="relative">
          <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="buildingName"
            name="condoName"
            value={formData.condoName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.buildingName.touched
                ? validation.buildingName.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        {validation.buildingName.touched && !validation.buildingName.valid && (
          <p className="mt-2 text-sm text-red-500">{validation.buildingName.error}</p>
        )}
      </div>

      <div className="relative">
        <label htmlFor="lobbyTower" className="block text-sm font-medium text-gray-200 mb-2">
          Lobby/Tower (Optional)
        </label>
        <div className="relative">
          <FiBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="lobbyTower"
            name="lobbyTower"
            value={formData.lobbyTower}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.lobbyTower.touched
                ? validation.lobbyTower.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        {validation.lobbyTower.touched && !validation.lobbyTower.valid && (
          <p className="mt-2 text-sm text-red-500">{validation.lobbyTower.error}</p>
        )}
      </div>
    </div>
  );
};

export default OptionalSection;