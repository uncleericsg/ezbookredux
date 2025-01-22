import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleNotFoundError, handleConfigurationError } from '@/utils/apiErrors';
import type { ServiceRating, DBServiceRating } from '@/types/rating';
import { mapDBRatingToServiceRating, mapServiceRatingToDB } from '@/types/rating';

export async function createRating(rating: Omit<ServiceRating, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRating> {
  logger.info('Creating service rating', { bookingId: rating.bookingId });

  const dbRating = mapServiceRatingToDB(rating);
  
  const { data, error } = await supabaseClient
    .from('service_ratings')
    .insert(dbRating)
    .select()
    .single();

  if (error) {
    logger.error('Failed to create service rating', {
      message: error.message,
      details: { bookingId: rating.bookingId }
    });
    throw handleConfigurationError({
      code: 'RATING_CREATE_FAILED',
      message: 'Failed to create service rating',
      originalError: error
    });
  }

  return mapDBRatingToServiceRating(data as DBServiceRating);
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
    throw handleConfigurationError({
      code: 'RATING_FETCH_FAILED',
      message: 'Failed to fetch ratings by booking',
      originalError: error
    });
  }

  if (!data?.length) {
    throw handleNotFoundError(`No ratings found for booking ${bookingId}`);
  }

  return data.map(rating => mapDBRatingToServiceRating(rating as DBServiceRating));
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
    throw handleConfigurationError({
      code: 'RATING_FETCH_FAILED',
      message: 'Failed to fetch ratings by user',
      originalError: error
    });
  }

  return data?.map(rating => mapDBRatingToServiceRating(rating as DBServiceRating)) || [];
}

export async function updateRating(
  id: string,
  rating: Partial<Omit<ServiceRating, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServiceRating> {
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
    throw handleConfigurationError({
      code: 'RATING_UPDATE_FAILED',
      message: 'Failed to update service rating',
      originalError: error
    });
  }

  if (!data) {
    throw handleNotFoundError(`Rating with id ${id} not found`);
  }

  return mapDBRatingToServiceRating(data as DBServiceRating);
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
    throw handleConfigurationError({
      code: 'RATING_DELETE_FAILED',
      message: 'Failed to delete service rating',
      originalError: error
    });
  }
}