import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from '../../../services/bookingService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';

const bookingService = new BookingService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json(
      createApiError('Invalid booking ID', 'VALIDATION_ERROR')
    );
  }

  try {
    const booking = await bookingService.getBooking(id);
    
    return res.status(200).json(
      createApiResponse({
        id: booking.id,
        customer: {
          id: booking.customer.id,
          name: booking.customer.full_name,
          email: booking.customer.email
        },
        service: {
          id: booking.service.id,
          name: booking.service.title,
          price: booking.service.price
        },
        status: booking.status,
        date: booking.scheduled_start,
        scheduled_start: booking.scheduled_start,
        scheduled_end: booking.scheduled_end,
        total_amount: booking.total_amount,
        payment_status: booking.payment_status,
        notes: booking.notes
      })
    );
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 