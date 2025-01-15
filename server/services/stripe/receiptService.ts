import PDFDocument from 'pdfkit';

import supabase from '../../config/database';
import { ApiError } from '../../utils/apiErrors';

export const generateReceipt = async (paymentIntentId: string) => {
  try {
    // Fetch payment details from database
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();

    if (error || !payment) {
      throw new ApiError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }

    // Create PDF document
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    
    doc.on('data', (chunk) => buffers.push(chunk));
    
    // Add content to PDF
    doc.fontSize(18).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Payment ID: ${payment.id}`);
    doc.text(`Amount: ${(payment.amount / 100).toFixed(2)} ${payment.currency}`);
    doc.text(`Date: ${new Date(payment.created_at).toLocaleString()}`);

    doc.end();

    // Return PDF buffer
    return new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);
    });
  } catch (error) {
    throw new ApiError('Failed to generate receipt', 500, 'RECEIPT_ERROR', error);
  }
};