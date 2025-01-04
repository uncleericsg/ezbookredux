import React from 'react';
import { FiUser } from 'react-icons/fi';
import type { PersonalInfoSectionProps } from '../types';

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  validation,
  onInputChange,
  onBlur
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
          First Name
        </label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.firstName.touched
                ? validation.firstName.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your first name"
          />
        </div>
        {validation.firstName.touched && !validation.firstName.valid && (
          <p className="mt-2 text-sm text-red-500">{validation.firstName.error}</p>
        )}
      </div>

      <div className="relative">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
          Last Name
        </label>
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.lastName.touched
                ? validation.lastName.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your last name"
          />
        </div>
        {validation.lastName.touched && !validation.lastName.valid && (
          <p className="mt-2 text-sm text-red-500">{validation.lastName.error}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;