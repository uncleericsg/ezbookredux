/**
 * Service Rating type definition
 */
export interface ServiceRating {
  id: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Database schema type for service ratings
 */
export interface DBServiceRating {
  id: string;
  booking_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Type mapping functions
 */
export function mapDBRatingToServiceRating(dbRating: DBServiceRating): ServiceRating {
  return {
    id: dbRating.id,
    bookingId: dbRating.booking_id,
    userId: dbRating.user_id,
    rating: dbRating.rating,
    comment: dbRating.comment,
    createdAt: dbRating.created_at,
    updatedAt: dbRating.updated_at
  };
}

export function mapServiceRatingToDB(
  rating: Omit<ServiceRating, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DBServiceRating, 'id' | 'created_at' | 'updated_at'> {
  return {
    booking_id: rating.bookingId,
    user_id: rating.userId,
    rating: rating.rating,
    comment: rating.comment
  };
}

/**
 * Rating error codes
 */
export type RatingErrorCode =
  | 'RATING_CREATE_FAILED'
  | 'RATING_UPDATE_FAILED'
  | 'RATING_DELETE_FAILED'
  | 'RATING_FETCH_FAILED'
  | 'INVALID_RATING';