/**
 * Review types
 */

/**
 * Review entity
 */
export interface Review {
  /**
   * Review ID
   */
  id: string;

  /**
   * Booking ID
   */
  booking_id: string;

  /**
   * User ID
   */
  user_id: string;

  /**
   * Rating (1-5)
   */
  rating: number;

  /**
   * Optional comment
   */
  comment?: string;

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Updated at timestamp
   */
  updated_at: string;
}

/**
 * Create review request
 */
export interface CreateReviewRequest {
  /**
   * Booking ID
   */
  booking_id: string;

  /**
   * Rating (1-5)
   */
  rating: number;

  /**
   * Optional comment
   */
  comment?: string;
}

/**
 * Get review response
 */
export interface GetReviewResponse {
  /**
   * Review ID
   */
  id: string;

  /**
   * Rating (1-5)
   */
  rating: number;

  /**
   * Optional comment
   */
  comment?: string;

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Customer information
   */
  customer: {
    /**
     * Customer ID
     */
    id: string;

    /**
     * Customer name
     */
    name: string;
  };

  /**
   * Booking information
   */
  booking: {
    /**
     * Booking ID
     */
    id: string;

    /**
     * Service information
     */
    service: {
      /**
       * Service ID
       */
      id: string;

      /**
       * Service title
       */
      title: string;
    };
  };
}

/**
 * Database review with relations
 */
export interface DatabaseReviewWithRelations {
  /**
   * Review ID
   */
  id: string;

  /**
   * Rating (1-5)
   */
  rating: number;

  /**
   * Optional comment
   */
  comment?: string;

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Customer information
   */
  customer: {
    /**
     * Customer ID
     */
    id: string;

    /**
     * Customer full name
     */
    full_name: string;
  };

  /**
   * Booking information
   */
  booking: {
    /**
     * Booking ID
     */
    id: string;

    /**
     * Service information
     */
    service: {
      /**
       * Service ID
       */
      id: string;

      /**
       * Service title
       */
      title: string;
    };
  };
}

/**
 * Review service interface
 */
export interface ReviewService {
  /**
   * Create a new review
   */
  createReview(userId: string, data: CreateReviewRequest): Promise<Review>;

  /**
   * Get review by ID
   */
  getReview(id: string): Promise<GetReviewResponse>;
}
