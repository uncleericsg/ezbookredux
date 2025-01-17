import { supabaseClient } from '@server/config/supabase/client';
import { Review, CreateReviewRequest, GetReviewResponse } from '@shared/types/review';
import { createApiError } from '@server/utils/apiResponse';

export class ReviewService {
	async createReview(userId: string, data: CreateReviewRequest): Promise<Review> {
		try {
			const { data: booking, error: bookingError } = await supabaseClient
				.from('bookings')
				.select('id, status')
				.eq('id', data.booking_id)
				.eq('user_id', userId)
				.single();

			if (bookingError || !booking) {
				throw createApiError('Booking not found', 'NOT_FOUND');
			}

			if (booking.status !== 'completed') {
				throw createApiError('Cannot review incomplete booking', 'VALIDATION_ERROR');
			}

			const { data: existingReview } = await supabaseClient
				.from('reviews')
				.select()
				.eq('booking_id', data.booking_id)
				.single();

			if (existingReview) {
				throw createApiError('Review already exists', 'VALIDATION_ERROR');
			}

			const { data: review, error } = await supabaseClient
				.from('reviews')
				.insert({
					booking_id: data.booking_id,
					user_id: userId,
					rating: data.rating,
					comment: data.comment || null
				})
				.select()
				.single();

			if (error) throw error;
			if (!review) throw new Error('Failed to create review');

			return review;
		} catch (error) {
			console.error('Review creation error:', error);
			throw createApiError('Failed to create review', 'SERVER_ERROR');
		}
	}

	async getReview(id: string): Promise<GetReviewResponse> {
		try {
			const { data: review, error } = await supabaseClient
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

			if (error) throw error;
			if (!review) throw createApiError('Review not found', 'NOT_FOUND');

			return {
				id: review.id,
				rating: review.rating,
				comment: review.comment,
				created_at: review.created_at,
				customer: {
					id: review.customer.id,
					name: review.customer.full_name
				},
				booking: {
					id: review.booking.id,
					service: {
						id: review.booking.service.id,
						title: review.booking.service.title
					}
				}
			};
		} catch (error) {
			console.error('Get review error:', error);
			throw createApiError('Failed to fetch review', 'SERVER_ERROR');
		}
	}
}