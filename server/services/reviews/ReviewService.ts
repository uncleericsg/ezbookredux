import { supabaseAdmin } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type {
  Review,
  CreateReviewRequest,
  GetReviewResponse,
  ReviewService as IReviewService,
  DatabaseReviewWithRelations
} from '@shared/types/review';

export class ReviewService implements IReviewService {
  async createReview(userId: string, data: CreateReviewRequest): Promise<Review> {
    try {
      logger.info('Creating review', { userId, bookingId: data.booking_id });

      // Verify booking exists and belongs to user
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from('bookings')
        .select('id, status')
        .eq('id', data.booking_id)
        .eq('user_id', userId)
        .single();

      if (bookingError || !booking) {
        logger.warn('Booking not found', { userId, bookingId: data.booking_id });
        throw ApiError.notFound('Booking', data.booking_id);
      }

      if (booking.status !== 'completed') {
        logger.warn('Cannot review incomplete booking', { 
          userId, 
          bookingId: data.booking_id,
          status: booking.status 
        });
        throw ApiError.validation('Cannot review incomplete booking');
      }

      // Check for existing review
      const { data: existingReview } = await supabaseAdmin
        .from('reviews')
        .select()
        .eq('booking_id', data.booking_id)
        .single();

      if (existingReview) {
        logger.warn('Review already exists', { userId, bookingId: data.booking_id });
        throw ApiError.validation('Review already exists');
      }

      // Create review
      const { data: review, error } = await supabaseAdmin
        .from('reviews')
        .insert({
          booking_id: data.booking_id,
          user_id: userId,
          rating: data.rating,
          comment: data.comment || null
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error creating review', { error, userId });
        throw ApiError.database('Failed to create review', error);
      }

      if (!review) {
        logger.error('Failed to create review - no review returned', { userId });
        throw ApiError.database('Failed to create review');
      }

      logger.info('Review created successfully', { 
        userId,
        reviewId: review.id,
        bookingId: data.booking_id 
      });

      return {
        id: review.id,
        booking_id: review.booking_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        updated_at: review.updated_at
      };
    } catch (error) {
      logger.error('Review creation error', { error: String(error), userId });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to create review');
    }
  }

  async getReview(id: string): Promise<GetReviewResponse> {
    try {
      logger.info('Fetching review', { id });

      const { data: review, error } = await supabaseAdmin
        .from('reviews')
        .select(`
          *,
          customer:profiles(id, full_name),
          booking:bookings(
            id,
            service:services(
              id,
              title
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Database error fetching review', { error, id });
        throw ApiError.database('Failed to fetch review', error);
      }

      if (!review) {
        logger.warn('Review not found', { id });
        throw ApiError.notFound('Review', id);
      }

      const reviewWithRelations = review as DatabaseReviewWithRelations;

      logger.info('Review fetched successfully', { id });

      return {
        id: reviewWithRelations.id,
        rating: reviewWithRelations.rating,
        comment: reviewWithRelations.comment,
        created_at: reviewWithRelations.created_at,
        customer: {
          id: reviewWithRelations.customer.id,
          name: reviewWithRelations.customer.full_name
        },
        booking: {
          id: reviewWithRelations.booking.id,
          service: {
            id: reviewWithRelations.booking.service.id,
            title: reviewWithRelations.booking.service.title
          }
        }
      };
    } catch (error) {
      logger.error('Get review error', { error: String(error), id });
      if (error instanceof ApiError) throw error;
      throw ApiError.server('Failed to fetch review');
    }
  }
}

export const reviewService = new ReviewService();
