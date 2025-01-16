# API Documentation
Version: 1.0.1
Last Updated: 2025-01-17

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Middleware](#middleware)
8. [Testing](#testing)

## Overview

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Response Format
All responses follow this structure:
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

## Authentication

### Bearer Token
```http
Authorization: Bearer <token>
```

Example:
```javascript
fetch('/api/bookings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Error Handling

### Error Codes
| Code | Description |
|------|-------------|
| AUTH_REQUIRED | Authentication is required |
| AUTH_INVALID | Invalid authentication token |
| VALIDATION_ERROR | Invalid request data |
| RATE_LIMIT_EXCEEDED | Too many requests |
| NOT_FOUND | Resource not found |
| SERVER_ERROR | Internal server error |

### Error Response Example
```json
{
  "error": {
    "message": "Invalid request data",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": ["validation error message"]
    }
  }
}
```

## Rate Limiting

- Window: 15 minutes
- Max Requests: 100 per IP
- Headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## API Endpoints

### Implementation Status

| Endpoint | Status | Priority |
|----------|---------|-----------|
| POST /api/bookings/create | ✅ Completed | High |
| GET /api/bookings/{id} | ✅ Completed | High |
| POST /api/payments/create-payment-intent | ✅ Completed | Medium |
| POST /api/payments/webhook | ✅ Completed | Medium |
| POST /api/reviews/create | ✅ Completed | Medium |
| GET /api/reviews/{id} | ✅ Completed | Medium |
| GET /api/profile | ✅ Completed | High |
| PUT /api/profile | ✅ Completed | High |
| PUT /api/profile/avatar | ✅ Completed | Medium |
| GET /api/bookings/available-slots | ✅ Completed | High |
| GET /api/bookings | ✅ Completed | High |
| POST /api/bookings/{id}/cancel | ✅ Completed | High |
| GET /api/payments/{id} | ✅ Completed | Medium |
| POST /api/payments/{id}/refund | ✅ Completed | Medium |
| GET /api/payments | ✅ Completed | Medium |
| PUT /api/bookings/{id} | ✅ Completed | High |

### Still To Be Implemented:

1. Authentication & Authorization
   - Middleware for protecting routes
   - User session management
   - Role-based access control

2. Address Management
   - GET /api/addresses - List user addresses
   - POST /api/addresses - Create address
   - PUT /api/addresses/{id} - Update address
   - DELETE /api/addresses/{id} - Delete address

3. Service Management
   - GET /api/services - List available services
   - GET /api/services/{id} - Get service details
   - POST /api/services (admin) - Create service
   - PUT /api/services/{id} (admin) - Update service

4. User Profile
   - GET /api/profile - Get user profile
   - PUT /api/profile - Update user profile
   - PUT /api/profile/avatar - Update profile picture

5. Booking Management Extensions
   - GET /api/bookings/available-slots - Get available time slots

6. Additional Payment Features
   - GET /api/payments/{id} - Get payment details
   - POST /api/payments/{id}/refund - Process refund
   - GET /api/payments - List payment history

7. Review Management Extensions
   - GET /api/reviews - List reviews
   - PUT /api/reviews/{id} - Update review
   - DELETE /api/reviews/{id} - Delete review

8. Admin Features
   - Dashboard statistics
   - User management
   - Service management
   - Booking management

9. Integration Features
   - Email notifications
   - SMS notifications
   - Calendar integration
   - Payment gateway webhooks

10. Additional Features
    - Rate limiting implementation
    - Caching strategy
    - Error logging
    - Analytics tracking

### Bookings

#### Create Booking
```http
POST /api/bookings/create
```

Request Body:
```typescript
interface CreateBookingRequest {
  serviceId: string;
  date: string;  // ISO 8601
  customerId: string;
  notes?: string;
}
```

Response:
```typescript
interface CreateBookingResponse {
  data: {
    id: string;
    status: 'pending' | 'confirmed';
    bookingReference: string;
    // ... other booking details
  };
}
```

#### Get Booking
```http
GET /api/bookings/{id}
```

Response:
```typescript
interface GetBookingResponse {
  data: {
    id: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
    service: {
      id: string;
      name: string;
      price: number;
    };
    status: BookingStatus;
    date: string;
    // ... other fields
  };
}
```

### Payments

#### Create Payment Intent
```http
POST /api/payments/create-payment-intent
```

Request Body:
```typescript
interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;  // default: 'sgd'
  bookingId: string;
  metadata?: Record<string, string>;
}
```

Response:
```typescript
interface CreatePaymentIntentResponse {
  data: {
    clientSecret: string;
    intentId: string;
  };
}
```

#### Webhook Handler
```http
POST /api/payments/webhook
```

Supported Events:
- `payment_intent.succeeded`
- `payment_intent.failed`
- `payment_intent.canceled`
```

## Data Models

### Booking
```typescript
interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  status: BookingStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';
```

### Payment
```typescript
interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded';