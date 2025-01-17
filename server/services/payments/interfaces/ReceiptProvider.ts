export interface Receipt {
  id: string;
  paymentId: string;
  url?: string;
  pdfUrl?: string;
  createdAt: Date;
  metadata?: Record<string, string>;
}

export interface GenerateReceiptParams {
  paymentId: string;
  customerEmail: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface ReceiptProvider {
  /**
   * Generates a new receipt for a payment
   * @param params Receipt generation parameters
   * @returns Generated receipt details
   * @throws ApiError if generation fails
   */
  generateReceipt(params: GenerateReceiptParams): Promise<Receipt>;

  /**
   * Retrieves receipt details by ID
   * @param receiptId Receipt ID to retrieve
   * @returns Receipt details
   * @throws ApiError if retrieval fails
   */
  getReceiptById(receiptId: string): Promise<Receipt>;

  /**
   * Lists all receipts for a payment
   * @param paymentId Payment ID to list receipts for
   * @returns Array of receipts
   * @throws ApiError if listing fails
   */
  listReceiptsByPayment(paymentId: string): Promise<Receipt[]>;

  /**
   * Sends receipt to customer email
   * @param receiptId Receipt ID to send
   * @param email Customer email address
   * @throws ApiError if sending fails
   */
  sendReceiptByEmail(receiptId: string, email: string): Promise<void>;
} 