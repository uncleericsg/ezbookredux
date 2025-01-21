import { supabaseAdmin } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressValidation,
  AddressGeocode,
  AddressError
} from '@shared/types/address';
import { googleMapsService } from '@server/services/integrations/google/GoogleMapsService';
import type { AddressComponents } from '@shared/types/google';

export class AddressService {
  async createAddress(userId: string, data: CreateAddressRequest): Promise<Address> {
    try {
      logger.info('Creating address', { userId, data });

      const validation = await this.validateAddress(data);
      if (!validation.isValid) {
        logger.warn('Invalid address data', { validation, userId, data });
        throw new ApiError('Invalid address data', 'VALIDATION_ERROR', 400, validation.errors);
      }

      const { data: address, error } = await supabaseAdmin
        .from('addresses')
        .insert({
          user_id: userId,
          block_street: data.block_street,
          floor_unit: data.floor_unit,
          postal_code: data.postal_code,
          condo_name: data.condo_name,
          lobby_tower: data.lobby_tower,
          special_instructions: data.special_instructions,
          is_default: data.is_default || false,
          is_verified: false,
          google_place_id: data.google_place_id,
          formatted_address: data.formatted_address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error creating address', { error, userId });
        throw new ApiError('Failed to create address', 'DATABASE_ERROR');
      }

      if (!address) {
        logger.error('Failed to create address - no address returned', { userId });
        throw new ApiError('Failed to create address', 'DATABASE_ERROR');
      }

      logger.info('Address created successfully', { addressId: address.id });
      return address;
    } catch (error) {
      logger.error('Create address error', { error: String(error), userId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create address', 'INTERNAL_SERVER_ERROR');
    }
  }

  async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
    try {
      logger.info('Updating address', { addressId, data });

      const validation = await this.validateAddress(data);
      if (!validation.isValid) {
        logger.warn('Invalid address data', { validation, addressId, data });
        throw new ApiError('Invalid address data', 'VALIDATION_ERROR', 400, validation.errors);
      }

      const { data: address, error } = await supabaseAdmin
        .from('addresses')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        logger.error('Database error updating address', { error, addressId });
        throw new ApiError('Failed to update address', 'DATABASE_ERROR');
      }

      if (!address) {
        logger.warn('Address not found', { addressId });
        throw new ApiError('Address not found', 'NOT_FOUND');
      }

      logger.info('Address updated successfully', { addressId });
      return address;
    } catch (error) {
      logger.error('Update address error', { error: String(error), addressId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update address', 'INTERNAL_SERVER_ERROR');
    }
  }

  async validateAddress(address: CreateAddressRequest | UpdateAddressRequest): Promise<AddressValidation> {
    try {
      logger.info('Validating address');

      const errors: AddressValidation['errors'] = {};

      // Validate block/street
      if ('block_street' in address && !address.block_street?.trim()) {
        errors.block_street = ['Block/street is required'];
      }

      // Validate floor/unit
      if ('floor_unit' in address && !address.floor_unit?.trim()) {
        errors.floor_unit = ['Floor/unit is required'];
      }

      // Validate postal code
      if ('postal_code' in address) {
        const postalCode = address.postal_code?.trim();
        if (!postalCode) {
          errors.postal_code = ['Postal code is required'];
        } else if (!/^\d{6}$/.test(postalCode)) {
          errors.postal_code = ['Invalid postal code format'];
        }
      }

      // Geocode address if all required fields are present
      if (
        'block_street' in address &&
        'postal_code' in address &&
        address.block_street &&
        address.postal_code
      ) {
        const formattedAddress = await this.formatAddress(address);
        const geocode = await googleMapsService.geocodeAddress(formattedAddress);

        // Check if geocoding was successful by verifying required components
        if (!geocode.components.postalCode || !geocode.components.route) {
          errors.general = ['Invalid address location'];
        }
      }

      const isValid = Object.keys(errors).length === 0;

      logger.info('Address validation complete', { isValid, errors });

      return {
        isValid,
        errors: isValid ? undefined : errors
      };
    } catch (error) {
      logger.error('Address validation error', { error: String(error) });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to validate address', 'INTERNAL_SERVER_ERROR');
    }
  }

  async formatAddress(address: CreateAddressRequest | UpdateAddressRequest): Promise<string> {
    const parts = [];

    if ('block_street' in address && address.block_street) {
      parts.push(address.block_street);
    }

    if ('floor_unit' in address && address.floor_unit) {
      parts.push(`#${address.floor_unit}`);
    }

    if ('postal_code' in address && address.postal_code) {
      parts.push(`Singapore ${address.postal_code}`);
    }

    return parts.join(', ');
  }

  async getAddressComponents(address: string): Promise<AddressComponents> {
    try {
      logger.info('Getting address components', { address });

      const geocode = await googleMapsService.geocodeAddress(address);
      return geocode.components;
    } catch (error) {
      logger.error('Get address components error', { error: String(error), address });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get address components', 'INTERNAL_SERVER_ERROR');
    }
  }

  async getServiceArea(address: string): Promise<string> {
    try {
      logger.info('Getting service area', { address });

      const geocode = await googleMapsService.geocodeAddress(address);
      return geocode.components.locality || 'Unknown';
    } catch (error) {
      logger.error('Get service area error', { error: String(error), address });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get service area', 'INTERNAL_SERVER_ERROR');
    }
  }

  async isServiceable(address: string): Promise<boolean> {
    try {
      logger.info('Checking if address is serviceable', { address });

      const geocode = await googleMapsService.geocodeAddress(address);
      const serviceArea = geocode.components.locality;

      // Check if service area is in our coverage
      const { data: coverage } = await supabaseAdmin
        .from('service_coverage')
        .select('is_active')
        .eq('area', serviceArea)
        .single();

      return Boolean(coverage?.is_active);
    } catch (error) {
      logger.error('Check serviceable error', { error: String(error), address });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to check if address is serviceable', 'INTERNAL_SERVER_ERROR');
    }
  }
}

export const addressService = new AddressService();
