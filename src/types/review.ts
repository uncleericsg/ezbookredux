export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface CreateReviewRequest {
  booking_id: string;
  rating: number;
  comment?: string;
}

export interface GetReviewResponse {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  customer: {
    id: string;
    name: string | null;
  };
  booking: {
    id: string;
    service: {
      id: string;
      title: string;
    };
  };
} 