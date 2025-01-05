import React from 'react';
import { FiHome, FiBox, FiCheck, FiX } from 'react-icons/fi';
import type { OptionalSectionProps } from '../types';

const OptionalSection: React.FC<OptionalSectionProps> = ({
  formData,
  validation,
  onInputChange,
  onBlur
}) => {
  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="buildingName" className="form-label">
            Condo Name (Optional)
          </label>
          <div className="relative">
            <FiHome className="absolute left-3" />
            <input
              type="text"
              id="buildingName"
              name="condoName"
              value={formData.condoName}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
            />
            {validation.buildingName.touched && (
              <div className={`validation-icon ${validation.buildingName.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.buildingName.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.buildingName.touched && !validation.buildingName.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.buildingName.error}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lobbyTower" className="form-label">
            Lobby/Tower (Optional)
          </label>
          <div className="relative">
            <FiBox className="absolute left-3" />
            <input
              type="text"
              id="lobbyTower"
              name="lobbyTower"
              value={formData.lobbyTower}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
            />
            {validation.lobbyTower.touched && (
              <div className={`validation-icon ${validation.lobbyTower.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.lobbyTower.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.lobbyTower.touched && !validation.lobbyTower.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.lobbyTower.error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionalSection;