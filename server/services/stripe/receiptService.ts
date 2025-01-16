import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import { logger } from '@/server/utils/logger';
import supabase from '@/server/config/database';
import { paymentService } from './paymentService';

interface ReceiptData {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  booking: {
    scheduled_at: string;
    customer: {
      first_name: string;
      last_name: string;
      email: string;
      mobile: string;
    };
    service: {
      title: string;
      duration: string;
      price: number;
    };
  };
}

export class ReceiptService {
  /**
   * Get receipt URL from Stripe
   */
  async getReceiptUrl(paymentIntentId: string): Promise<string> {
    try {
      const paymentIntent = await paymentService.getPaymentIntent(paymentIntentId);
      const receiptUrl = paymentIntent.charges?.data?.[0]?.receipt_url;

      if (!receiptUrl) {
        throw new Error('Receipt URL not found');
      }

      logger.info('Receipt URL retrieved', { paymentIntentId });
      return receiptUrl;
    } catch (error) {
      logger.error('Failed to get receipt URL', { error, paymentIntentId });
      throw error;
    }
  }

  /**
   * Generate PDF receipt
   */
  async generateReceipt(paymentIntentId: string): Promise<Buffer> {
    try {
      // Get payment details from database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select(`
          *,
          booking:bookings (
            scheduled_at,
            customer:users (
              first_name,
              last_name,
              email,
              mobile
            ),
            service:services (
              title,
              price,
              duration
            )
          )
        `)
        .eq('payment_intent_id', paymentIntentId)
        .single();

      if (paymentError || !payment) {
        throw new Error('Payment not found');
      }

      return await this.generatePDF(payment as ReceiptData);
    } catch (error) {
      logger.error('Failed to generate receipt', { error, paymentIntentId });
      throw error;
    }
  }

  private async generatePDF(data: ReceiptData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        // Collect data chunks
        doc.on('data', chunks.push.bind(chunks));
        doc.on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        });

        // Add receipt content
        doc
          .fontSize(20)
          .text('iAircon Service Receipt', { align: 'center' })
          .moveDown()
          .fontSize(12)
          .text(`Receipt Number: ${data.id}`)
          .text(`Date: ${format(new Date(data.created_at), 'PPpp')}`)
          .moveDown()
          .text('Customer Details:')
          .text(`Name: ${data.booking.customer.first_name} ${data.booking.customer.last_name}`)
          .text(`Email: ${data.booking.customer.email}`)
          .text(`Mobile: ${data.booking.customer.mobile}`)
          .moveDown()
          .text('Service Details:')
          .text(`Service: ${data.booking.service.title}`)
          .text(`Duration: ${data.booking.service.duration}`)
          .text(`Appointment: ${format(new Date(data.booking.scheduled_at), 'PPpp')}`)
          .moveDown()
          .text('Payment Details:')
          .text(`Amount: SGD ${(data.amount / 100).toFixed(2)}`)
          .text(`Status: ${data.status}`)
          .text(`Payment Method: Credit Card`)
          .moveDown()
          .fontSize(10)
          .text('Thank you for choosing iAircon Services!', { align: 'center' })
          .text('For any questions, please contact us at support@iaircon.com', { align: 'center' });

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const receiptService = new ReceiptService();