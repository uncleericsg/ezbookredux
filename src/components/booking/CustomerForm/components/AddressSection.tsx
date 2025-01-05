import React, { useRef } from 'react';
import { FiMapPin, FiHome, FiHash, FiCheck, FiX } from 'react-icons/fi';
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
        }
      }, 100);
    }
  });

  return (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Street Address {!isGoogleMapsLoaded && <span className="text-xs text-gray-400">(Loading address search...)</span>}
        </label>
        <div className="relative">
          <FiMapPin className="absolute left-3" />
          <input
            ref={setInputRef}
            type="text"
            id="address"
            name="blockStreet"
            required
            value={formData.blockStreet}
            onChange={onInputChange}
            onBlur={onBlur}
            className="form-input"
            placeholder={!isGoogleMapsLoaded ? "Loading address search..." : ""}
            disabled={!isGoogleMapsLoaded}
          />
          {validation.address.touched && (
            <div className={`validation-icon ${validation.address.valid ? 'text-green-400' : 'text-red-400'}`}>
              {validation.address.valid ? <FiCheck /> : <FiX />}
            </div>
          )}
        </div>
        {validation.address.touched && !validation.address.valid && (
          <div className="text-red-500 text-xs mt-1">{validation.address.error}</div>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="postalCode" className="form-label">
            Postal Code
          </label>
          <div className="relative">
            <FiHome className="absolute left-3" />
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
              readOnly
            />
            {validation.postalCode.touched && (
              <div className={`validation-icon ${validation.postalCode.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.postalCode.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.postalCode.touched && !validation.postalCode.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.postalCode.error}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="unit" className="form-label">
            Unit Number (NA if none)
          </label>
          <div className="relative">
            <FiHash className="absolute left-3" />
            <input
              ref={unitInputRef}
              type="text"
              id="unit"
              name="floorUnit"
              required
              value={formData.floorUnit}
              onChange={onInputChange}
              onBlur={onBlur}
              className="form-input"
            />
            {validation.unit.touched && (
              <div className={`validation-icon ${validation.unit.valid ? 'text-green-400' : 'text-red-400'}`}>
                {validation.unit.valid ? <FiCheck /> : <FiX />}
              </div>
            )}
          </div>
          {validation.unit.touched && !validation.unit.valid && (
            <div className="text-red-500 text-xs mt-1">{validation.unit.error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;