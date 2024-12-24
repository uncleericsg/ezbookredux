import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { Address } from './addressService';

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  floor_unit: string;
  block_street: string;
  postal_code: string;
  condo_name?: string;
  lobby_tower?: string;
  special_instructions?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingDetails {
  id?: string;
  
  // Customer Information
  customer_info: CustomerInfo;
  
  // Address Information
  address_id?: string;
  address_snapshot?: Address;
  
  // Service Information
  service_id: string;
  service_title: string;
  service_price: number;
  service_duration: string;
  service_description?: string;
  
  // Booking Details
  brands: string[];
  issues: string[];
  other_issue?: string;
  is_amc: boolean;
  
  // Schedule Information
  scheduled_datetime: Date;
  scheduled_timeslot: string;
  
  // Status and Timestamps
  status?: BookingStatus;
  created_at?: string;
  updated_at?: string;
  
  // Payment Information
  payment_status?: string;
  payment_intent_id?: string;
  total_amount?: number;
  tip_amount?: number;
  
  // Additional Metadata
  metadata?: Record<string, any>;
}

export const createBooking = async (bookingDetails: Omit<BookingDetails, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    // Get current user if available
    const { data: { user } } = await supabase.auth.getUser();
    
    const bookingId = uuidv4();

    // First, get the service UUID from the services table
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('id')
      .eq('id', bookingDetails.service_id) // Using id directly since it's already a valid service ID
      .single();

    if (serviceError || !serviceData) {
      console.error('Error finding service:', serviceError);
      throw new Error('Service not found');
    }

    // Create address snapshot from customer info if no address_id is provided
    const addressSnapshot = bookingDetails.address_id ? bookingDetails.address_snapshot : {
      floor_unit: bookingDetails.customer_info.floor_unit,
      block_street: bookingDetails.customer_info.block_street,
      postal_code: bookingDetails.customer_info.postal_code,
      condo_name: bookingDetails.customer_info.condo_name,
      lobby_tower: bookingDetails.customer_info.lobby_tower,
      special_instructions: bookingDetails.customer_info.special_instructions
    };

    const { error } = await supabase
      .from('bookings')
      .insert([{
        id: bookingId,
        // Customer and address information
        customer_info: bookingDetails.customer_info,
        address_id: bookingDetails.address_id,
        address_snapshot: addressSnapshot,
        // Service information
        service_id: serviceData.id,
        service_title: bookingDetails.service_title,
        service_price: bookingDetails.service_price,
        service_duration: bookingDetails.service_duration,
        service_description: bookingDetails.service_description,
        // Booking details
        brands: bookingDetails.brands,
        issues: bookingDetails.issues,
        other_issue: bookingDetails.other_issue,
        is_amc: bookingDetails.is_amc,
        // Schedule
        scheduled_datetime: bookingDetails.scheduled_datetime.toISOString(),
        scheduled_timeslot: bookingDetails.scheduled_timeslot,
        // Status
        status: bookingDetails.status || 'pending',
        payment_status: bookingDetails.payment_status,
        payment_intent_id: bookingDetails.payment_intent_id,
        total_amount: bookingDetails.total_amount,
        tip_amount: bookingDetails.tip_amount || 0,
        // Metadata
        metadata: {
          ...bookingDetails.metadata,
          user_id: user?.id || 'anonymous',
          user_email: user?.email || bookingDetails.customer_info.email,
          created_from: 'web',
          created_at: new Date().toISOString()
        }
      }]);

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }

    return bookingId;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

export const updateBooking = async (bookingId: string, updateData: Partial<BookingDetails>): Promise<void> => {
  try {
    // If updating customer info, also update address snapshot
    if (updateData.customer_info && !updateData.address_id) {
      updateData.address_snapshot = {
        floor_unit: updateData.customer_info.floor_unit,
        block_street: updateData.customer_info.block_street,
        postal_code: updateData.customer_info.postal_code,
        condo_name: updateData.customer_info.condo_name,
        lobby_tower: updateData.customer_info.lobby_tower,
        special_instructions: updateData.customer_info.special_instructions
      };
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  } catch (error) {
    console.error('Error in updateBooking:', error);
    throw error;
  }
};

export const getBookingById = async (bookingId: string): Promise<BookingDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        address:addresses(*)
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data as BookingDetails;
  } catch (error) {
    console.error('Error in getBookingById:', error);
    throw error;
  }
};

export const getUserBookings = async (): Promise<BookingDetails[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return [];
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        address:addresses(*)
      `)
      .eq('metadata->>user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }

    return data as BookingDetails[];
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    throw error;
  }
};

export const getBookingsByEmail = async (email: string): Promise<BookingDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        address:addresses(*)
      `)
      .eq('metadata->>user_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data as BookingDetails[];
  } catch (error) {
    console.error('Error in getBookingsByEmail:', error);
    throw error;
  }
};
