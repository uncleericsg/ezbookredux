import express from 'express';
import Stripe from 'stripe';
import PDFDocument from 'pdfkit';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Get Stripe receipt URL
router.get('/:paymentIntentId/receipt', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.charges.data[0]?.receipt_url) {
      return res.json({ receiptUrl: paymentIntent.charges.data[0].receipt_url });
    }
    
    res.status(404).json({ error: 'Receipt not found' });
  } catch (error) {
    console.error('Error getting Stripe receipt:', error);
    res.status(500).json({ error: 'Failed to get receipt' });
  }
});

// Generate custom receipt
router.get('/:paymentIntentId/generate-receipt', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

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

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=receipt-${paymentIntentId}.pdf`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add company logo and header
    doc
      .fontSize(20)
      .text('iAircon Service Receipt', { align: 'center' })
      .moveDown();

    // Add receipt details
    doc
      .fontSize(12)
      .text(`Receipt Number: ${payment.id}`)
      .text(`Date: ${format(new Date(payment.created_at), 'PPpp')}`)
      .moveDown()
      .text('Customer Details:')
      .text(`Name: ${payment.booking.customer.first_name} ${payment.booking.customer.last_name}`)
      .text(`Email: ${payment.booking.customer.email}`)
      .text(`Mobile: ${payment.booking.customer.mobile}`)
      .moveDown()
      .text('Service Details:')
      .text(`Service: ${payment.booking.service.title}`)
      .text(`Duration: ${payment.booking.service.duration}`)
      .text(`Appointment: ${format(new Date(payment.booking.scheduled_at), 'PPpp')}`)
      .moveDown()
      .text('Payment Details:')
      .text(`Amount: SGD ${(payment.amount / 100).toFixed(2)}`)
      .text(`Status: ${payment.status}`)
      .text(`Payment Method: Credit Card`)
      .moveDown();

    // Add footer
    doc
      .fontSize(10)
      .text('Thank you for choosing iAircon Services!', { align: 'center' })
      .text('For any questions, please contact us at support@iaircon.com', { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Failed to generate receipt' });
  }
});

export default router;
