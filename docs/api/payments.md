# Payment API Documentation

## Endpoints

### Health Check
```http
GET /api/health
```

Returns the health status of the API.

#### Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-16T08:00:00.000Z",
  "uptime": 1234.56,
  "environment": "development"
}
```

### Create Payment Intent
```http
POST /api/payments/create-payment-intent
```

Creates a new payment intent for processing payments.

#### Request Body
```json
{
  "amount": 1000, // Amount in cents
  "currency": "sgd",
  "metadata": {
    "bookingId": "123",
    "serviceId": "456"
  }
}
```

#### Response
```json
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_..."
}
```

### Get Receipt
```http
GET /api/payments/receipt/:id
```

Retrieves a receipt by ID.

#### Parameters
- `id`: Payment intent ID

#### Response
```json
{
  "receiptUrl": "https://..."
}
```

### Generate Receipt
```http
POST /api/payments/receipt/generate
```

Generates a PDF receipt for a payment.

#### Request Body
```json
{
  "paymentIntentId": "pi_..."
}
```

#### Response
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="receipt-{paymentIntentId}.pdf"

### Stripe Webhook
```http
POST /api/payments/webhook
```

Handles Stripe webhook events.

#### Headers
- `stripe-signature`: Stripe webhook signature

#### Response
```json
{
  "received": true
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing the issue"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 405 Method Not Allowed
```json
{
  "message": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
``` 