import { supabaseClient } from '@server/config/supabase/client';
import type { Review, CreateReviewRequest, GetReviewResponse } from '../types/review';
import { createApiError } from '../utils/error';
import type { ErrorCode } from '@shared/types/error';

const SERVER_ERROR: ErrorCode = 'INTERNAL_ERROR';

export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  try {
    const { data: review, error } = await supabaseClient
      .from('reviews')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!review) {
      throw createApiError('Failed to create review', SERVER_ERROR);
    }

    return review;
  } catch (error) {
    throw createApiError('Failed to create review', SERVER_ERROR);
  }
};

export const getReview = async (id: string): Promise<GetReviewResponse> => {
  try {
    const { data: review, error } = await supabaseClient
      .from('reviews')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!review) {
      throw createApiError('Review not found', 'NOT_FOUND');
    }

    return review;
  } catch (error) {
    throw createApiError('Failed to fetch review', SERVER_ERROR);
  }
}; 