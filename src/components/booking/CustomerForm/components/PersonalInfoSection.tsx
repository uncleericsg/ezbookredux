import React from 'react';
import { FiUser, FiCheck, FiX } from 'react-icons/fi';
import type { PersonalInfoSectionProps } from '../types';

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  validation,
  onInputChange,
  onBlur
}) => {
  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
              placeholder="Enter your first name"
            />
            {validation.firstName.touched && (
              <div className={`validation-icon ${validation.firstName.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.firstName.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.firstName.touched && !validation.firstName.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.firstName.error}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
              placeholder="Enter your last name"
            />
            {validation.lastName.touched && (
              <div className={`validation-icon ${validation.lastName.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.lastName.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.lastName.touched && !validation.lastName.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.lastName.error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;