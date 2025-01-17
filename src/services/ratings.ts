import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleNotFoundError } from '@/utils/apiErrors';
import type { ServiceRating } from '@/types/service';

export async function createRating(rating: Omit<ServiceRating, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRating> {
  logger.info('Creating service rating', { bookingId: rating.bookingId });

  const { data, error } = await supabaseClient
    .from('service_ratings')
    .insert({
      booking_id: rating.bookingId,
      user_id: rating.userId,
      rating: rating.rating,
      comment: rating.comment
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create service rating', {
      message: error.message,
      details: { bookingId: rating.bookingId }
    });
    throw error;
  }

  return {
    id: data.id,
    bookingId: data.booking_id,
    userId: data.user_id,
    rating: data.rating,
    comment: data.comment,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function getRatingsByBooking(bookingId: string): Promise<ServiceRating[]> {
  logger.info('Fetching ratings by booking', { bookingId });

  const { data, error } = await supabaseClient
    .from('service_ratings')
    .select()
    .eq('booking_id', bookingId);

  if (error) {
    logger.error('Failed to fetch ratings by booking', {
      message: error.message,
      details: { bookingId }
    });
    throw error;
  }

  if (!data?.length) {
    throw handleNotFoundError(`No ratings found for booking ${bookingId}`);
  }

  return data.map(rating => ({
    id: rating.id,
    bookingId: rating.booking_id,
    userId: rating.user_id,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at
  }));
}

export async function getRatingsByUser(userId: string): Promise<ServiceRating[]> {
  logger.info('Fetching ratings by user', { userId });

  const { data, error } = await supabaseClient
    .from('service_ratings')
    .select()
    .eq('user_id', userId);

  if (error) {
    logger.error('Failed to fetch ratings by user', {
      message: error.message,
      details: { userId }
    });
    throw error;
  }

  return data?.map(rating => ({
    id: rating.id,
    bookingId: rating.booking_id,
    userId: rating.user_id,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at
  })) || [];
}

export async function updateRating(id: string, rating: Partial<Omit<ServiceRating, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceRating> {
  logger.info('Updating service rating', { id });

  const { data, error } = await supabaseClient
    .from('service_ratings')
    .update({
      rating: rating.rating,
      comment: rating.comment
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update service rating', {
      message: error.message,
      details: { id }
    });
    throw error;
  }

  if (!data) {
    throw handleNotFoundError(`Rating with id ${id} not found`);
  }

  return {
    id: data.id,
    bookingId: data.booking_id,
    userId: data.user_id,
    rating: data.rating,
    comment: data.comment,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteRating(id: string): Promise<void> {
  logger.info('Deleting service rating', { id });

  const { error } = await supabaseClient
    .from('service_ratings')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete service rating', {
      message: error.message,
      details: { id }
    });
    throw error;
  }
}