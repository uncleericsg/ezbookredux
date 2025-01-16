import { PrismaClient } from '@prisma/client';
import { Booking, CreateBookingInput, UpdateBookingInput } from '../types/booking';

const prisma = new PrismaClient();

export class BookingRepository {
  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const booking = await prisma.booking.create({
      data: {
        customer_info: input.customerInfo,
        serviceId: input.serviceIds[0],
        scheduled_datetime: input.startTime,
        scheduled_timeslot: input.endTime.toISOString(),
        status: 'pending'
      },
      include: {
        service: true,
        payment: true
      }
    });

    return {
      ...booking,
      service: booking.service,
      customer_info: booking.customer_info as Record<string, any>
    };
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        payment: true
      }
    });

    if (!booking) return null;

    return {
      ...booking,
      service: booking.service,
      payment: booking.payment || [],
      customer_info: booking.customer_info as Record<string, any>
    };
  }

  async updateBooking(id: string, input: UpdateBookingInput): Promise<Booking> {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...input,
        customer_info: input.customerInfo
      },
      include: {
        service: true,
        payment: true
      }
    });

    return {
      ...booking,
      service: booking.service,
      payment: booking.payment || [],
      customer_info: booking.customer_info as Record<string, any>
    };
  }

  async deleteBooking(id: string): Promise<void> {
    await prisma.booking.delete({
      where: { id }
    });
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: {
        customer_info: {
          path: ['id'],
          equals: customerId
        }
      },
      include: {
        service: true,
        payment: true
      }
    });

    return bookings.map(booking => ({
      ...booking,
      service: booking.service,
      payment: booking.payment || [],
      customer_info: booking.customer_info as Record<string, any>
    }));
  }
}