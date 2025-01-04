import React, { useRef } from 'react';
import { FiMapPin, FiHome, FiHash } from 'react-icons/fi';
import type { AddressSectionProps } from '../types';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';

const AddressSection: React.FC<AddressSectionProps> = ({
  formData,
  validation,
  onInputChange,
  onBlur
}) => {
  const unitInputRef = useRef<HTMLInputElement>(null);
  const { setInputRef, isGoogleMapsLoaded } = useAddressAutocomplete({
    onAddressSelect: (addressData) => {
      console.log('Address selected:', addressData);

      // Update block/street
      if (addressData.blockStreet) {
        const addressEvent = {
          target: {
            name: 'blockStreet',
            value: addressData.blockStreet
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(addressEvent);
      }

      // Update postal code
      if (addressData.postalCode) {
        console.log('Setting postal code:', addressData.postalCode);
        const postalEvent = {
          target: {
            name: 'postalCode',
            value: addressData.postalCode
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(postalEvent);
      }

      // Update condo name if available
      if (addressData.buildingName) {
        const buildingEvent = {
          target: {
            name: 'condoName',
            value: addressData.buildingName
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(buildingEvent);
      }

      // Focus unit field after address selection
      setTimeout(() => {
        if (unitInputRef.current) {
          unitInputRef.current.focus();
          unitInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  });

  return (
    <div className="space-y-8">
      <div className="relative">
        <label htmlFor="address" className="block text-sm font-medium text-gray-200 mb-2">
          Street Address {!isGoogleMapsLoaded && <span className="text-xs text-gray-400">(Loading address search...)</span>}
        </label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={setInputRef}
            type="text"
            id="address"
            name="blockStreet"
            required
            value={formData.blockStreet}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
              validation.address.touched
                ? validation.address.valid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-600'
            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder={!isGoogleMapsLoaded ? "Loading address search..." : "Enter your address"}
            disabled={!isGoogleMapsLoaded}
          />
        </div>
        {validation.address.touched && !validation.address.valid && (
          <p className="mt-2 text-sm text-red-500">{validation.address.error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-200 mb-2">
            Postal Code
          </label>
          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={onInputChange}
              onBlur={onBlur}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                validation.postalCode.touched
                  ? validation.postalCode.valid
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-gray-600'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Auto-filled from address"
              readOnly
            />
          </div>
          {validation.postalCode.touched && !validation.postalCode.valid && (
            <p className="mt-2 text-sm text-red-500">{validation.postalCode.error}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="unit" className="block text-sm font-medium text-gray-200 mb-2">
            Unit Number (NA if none)
          </label>
          <div className="relative">
            <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={unitInputRef}
              type="text"
              id="unit"
              name="floorUnit"
              required
              value={formData.floorUnit}
              onChange={onInputChange}
              onBlur={onBlur}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border ${
                validation.unit.touched
                  ? validation.unit.valid
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-gray-600'
              } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          {validation.unit.touched && !validation.unit.valid && (
            <p className="mt-2 text-sm text-red-500">{validation.unit.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;