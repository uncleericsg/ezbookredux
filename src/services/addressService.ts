import { supabase } from '../lib/supabase';

export interface AddressType {
  id: string;
  name: string;
}

export interface Address {
  id?: string;
  user_id: string;
  block_street: string;
  floor_unit: string;
  postal_code: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
  is_default?: boolean;
  is_verified?: boolean;
  google_place_id?: string;
  formatted_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Building {
  id: string;
  name: string;
  block_street: string;
  postal_code: string;
  has_lobby: boolean;
  has_towers: boolean;
  total_towers?: number;
  total_floors?: number;
  google_place_id?: string;
  lat?: number;
  lng?: number;
}

export interface BuildingTower {
  id: string;
  building_id: string;
  tower_name: string;
  total_floors?: number;
}

export interface GooglePlaceData {
  place_id: string;
  formatted_address: string;
}

export const getAddressTypes = async (): Promise<AddressType[]> => {
  const { data, error } = await supabase
    .from('address_types')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching address types:', error);
    return [];
  }

  return data;
};

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }

  return data;
};

export const getAddressById = async (id: string): Promise<Address | null> => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching address:', error);
    return null;
  }

  return data;
};

export const createAddress = async (
  address: Omit<Address, 'id' | 'created_at' | 'updated_at'>, 
  placeData?: GooglePlaceData
): Promise<Address | null> => {
  // If this is set as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', address.user_id)
      .eq('is_default', true);
  }

  const addressData = {
    ...address,
    is_verified: !!placeData,
    google_place_id: placeData?.place_id,
    formatted_address: placeData?.formatted_address
  };

  const { data, error } = await supabase
    .from('addresses')
    .insert([addressData])
    .select()
    .single();

  if (error) {
    console.error('Error creating address:', error);
    return null;
  }

  return data;
};

export const updateAddress = async (id: string, address: Partial<Address>): Promise<Address | null> => {
  // If setting as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', address.user_id!)
      .eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(address)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    return null;
  }

  return data;
};

export const deleteAddress = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting address:', error);
    return false;
  }

  return true;
};

export const setDefaultAddress = async (userId: string, addressId: string): Promise<boolean> => {
  try {
    // First, unset any existing default
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true);

    // Then set the new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting default address:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setDefaultAddress:', error);
    return false;
  }
};

export const findBuildingByPostal = async (postalCode: string): Promise<Building | null> => {
  const { data, error } = await supabase
    .from('buildings')
    .select(`
      *,
      towers:building_towers(*)
    `)
    .eq('postal_code', postalCode)
    .single();

  if (error) {
    console.error('Error finding building:', error);
    return null;
  }

  return data;
};

export const createBuilding = async (building: Omit<Building, 'id' | 'created_at' | 'updated_at'>): Promise<Building | null> => {
  const { data, error } = await supabase
    .from('buildings')
    .insert([building])
    .select()
    .single();

  if (error) {
    console.error('Error creating building:', error);
    return null;
  }

  return data;
};

export const addBuildingTower = async (tower: Omit<BuildingTower, 'id' | 'created_at' | 'updated_at'>): Promise<BuildingTower | null> => {
  const { data, error } = await supabase
    .from('building_towers')
    .insert([tower])
    .select()
    .single();

  if (error) {
    console.error('Error adding building tower:', error);
    return null;
  }

  return data;
};
