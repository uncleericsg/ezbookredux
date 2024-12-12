import axios from 'axios';

export interface ServiceRating {
  id: string;
  serviceId: string;
  userId: string;
  rating: number;
  feedback?: string;
  createdAt: string;
}

export const submitServiceRating = async (
  serviceId: string,
  rating: number,
  feedback?: string
): Promise<ServiceRating> => {
  if (import.meta.env.DEV) {
    // Simulate API call in development
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now().toString(),
      serviceId,
      userId: 'test-user',
      rating,
      feedback,
      createdAt: new Date().toISOString()
    };
  }

  try {
    const response = await axios.post('/api/ratings', {
      serviceId,
      rating,
      feedback
    });
    return response.data;
  } catch (error) {
    console.error('Failed to submit rating:', error);
    throw error;
  }
};