import { supabaseClient } from '@server/config/supabase/client';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '@shared/types/address';
import { createApiError } from '@server/utils/apiResponse';

export class AddressService {
  async listAddresses(userId: string): Promise<Address[]> {
    try {
      const { data, error } = await supabaseClient
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('List addresses error:', error);
      throw createApiError('Failed to fetch addresses', 'SERVER_ERROR');
    }
  }

  async createAddress(userId: string, data: CreateAddressRequest): Promise<Address> {
    try {
      // If this is the first address or marked as default, handle default status
      if (data.is_default) {
        await supabaseClient
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .eq('is_default', true);
      }

      const { data: address, error } = await supabaseClient
        .from('addresses')
        .insert({
          ...data,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      if (!address) throw new Error('Failed to create address');

      return address;
    } catch (error) {
      console.error('Create address error:', error);
      throw createApiError('Failed to create address', 'SERVER_ERROR');
    }
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressRequest): Promise<Address> {
    try {
      // Verify address belongs to user
      const { data: existing } = await supabaseClient
        .from('addresses')
        .select()
        .eq('id', addressId)
        .eq('user_id', userId)
        .single();

      if (!existing) {
        throw createApiError('Address not found', 'NOT_FOUND');
      }

      // Handle default status updates
      if (data.is_default) {
        await supabaseClient
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .eq('is_default', true);
      }

      const { data: address, error } = await supabaseClient
        .from('addresses')
        .update(data)
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;
      if (!address) throw new Error('Failed to update address');

      return address;
    } catch (error) {
      console.error('Update address error:', error);
      throw createApiError('Failed to update address', 'SERVER_ERROR');
    }
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      const { error } = await supabaseClient
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Delete address error:', error);
      throw createApiError('Failed to delete address', 'SERVER_ERROR');
    }
  }
}
