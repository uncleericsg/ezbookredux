# API Documentation

## Overview

This document outlines the API endpoints available in the application. All endpoints follow a standardized response format and error handling.

## Authentication

Most endpoints require authentication using a Bearer token. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "data": <response_data>,
  "meta": {
    "total": <total_count>  // Optional, included in list responses
  }
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}  // Optional additional error details
  }
}
```

## Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Requested resource not found
- `UNAUTHORIZED` - Authentication required or failed
- `METHOD_NOT_ALLOWED` - HTTP method not supported
- `SERVICE_ERROR` - External service error
- `SERVER_ERROR` - Internal server error

## Endpoints

### Bookings

#### GET /api/bookings/[id]
Get booking details by ID.

**Authentication Required**: Yes

**Response**:
```json
{
  "data": {
    "id": "string",
    "customer": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    },
    "service": {
      "id": "string",
      "title": "string",
      "price": "number"
    },
    "status": "string",
    "date": "string",
    "notes": "string",
    "totalAmount": "number"
  }
}
```

#### POST /api/bookings/[id]
Cancel a booking.

**Authentication Required**: Yes

**Request Body**:
```json
{
  "action": "cancel"
}
```

**Response**:
```json
{
  "data": {
    "success": true
  }
}
```

#### POST /api/bookings/create
Create a new booking.

**Authentication Required**: Yes

**Request Body**:
```json
{
  "serviceId": "string",
  "date": "string",
  "notes": "string"
}
```

**Response**:
```json
{
  "data": {
    "id": "string",
    "status": "pending",
    "totalAmount": "number"
  }
}
```

#### GET /api/bookings/email/[email]
Get bookings by customer email.

**Authentication Required**: Yes

**Query Parameters**:
- `status` (optional) - Filter by booking status
- `startDate` (optional) - Filter by start date
- `endDate` (optional) - Filter by end date

**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "service": {
        "id": "string",
        "title": "string"
      },
      "status": "string",
      "date": "string",
      "totalAmount": "number"
    }
  ],
  "meta": {
    "total": "number"
  }
}
```

#### GET /api/bookings/customer/[customerId]
Get bookings by customer ID.

**Authentication Required**: Yes
**Authorization**: Customer can only view their own bookings

**Query Parameters**:
- `status` (optional) - Filter by booking status
- `startDate` (optional) - Filter by start date
- `endDate` (optional) - Filter by end date

**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "service": {
        "id": "string",
        "title": "string"
      },
      "status": "string",
      "date": "string",
      "totalAmount": "number"
    }
  ],
  "meta": {
    "total": "number"
  }
}
```

### Payments

#### POST /api/payments/webhook
Handle Stripe webhook events.

**Authentication Required**: No (Uses Stripe signature verification)

**Request Body**: Stripe event object

**Response**:
```json
{
  "received": true
}
```

### Geocoding

#### GET /api/geocode
Geocode a postal code to address details.

**Authentication Required**: Yes

**Query Parameters**:
- `postalCode` - Singapore postal code

**Response**:
```json
{
  "data": [
    {
      "formatted_address": "string",
      "geometry": {
        "location": {
          "lat": "number",
          "lng": "number"
        }
      },
      "place_id": "string"
    }
  ],
  "meta": {
    "total": "number"
  }
}
```

### Health Check

#### GET /api/health
Check API health status.

**Authentication Required**: No

**Response**:
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "string",
    "uptime": "number",
    "environment": "string"
  }
}
```

## Error Handling

All endpoints use standardized error handling:

1. Validation errors return 400 status code
2. Authentication errors return 401 status code
3. Authorization errors return 403 status code
4. Not found errors return 404 status code
5. Method not allowed errors return 405 status code
6. Server errors return 500 status code

## Logging

All API endpoints include logging:

1. Request information (method, path, query parameters)
2. Authentication status
3. Error details (when applicable)
4. Response timing
5. User ID (when authenticated)

## Rate Limiting

API endpoints are rate-limited based on:

1. IP address
2. User ID (when authenticated)
3. Endpoint specific limits

## Environment Variables

Required environment variables:

```env
GOOGLE_MAPS_API_KEY=<key>  # Required for geocoding
STRIPE_SECRET_KEY=<key>    # Required for payments
STRIPE_WEBHOOK_SECRET=<key> # Required for webhook verification