# Service Pricing Flow Documentation

## Overview
This document outlines the data flow and implementation pattern for service pricing pages in the iAircon booking system. The system uses a consistent mapping between frontend service options and database records to ensure reliable booking and payment processing.

## Database Schema (services table)

```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR NOT NULL,
    description TEXT,
    usual_price DECIMAL(10,2),
    is_premium BOOLEAN DEFAULT false,
    appointment_type_id VARCHAR UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Key Fields:
- `id`: UUID used for database relationships
- `appointment_type_id`: String identifier used to map frontend service selections to database records
- `title`: Display name of the service
- `price`: Current price of the service
- `usual_price`: Original/non-discounted price (if applicable)
- `duration`: Expected service duration
- `description`: Detailed service description
- `is_premium`: Boolean flag for premium services

## Frontend Implementation

### 1. Service Option Interface
```typescript
interface ServiceOption {
  id: string;  // Maps to appointment_type_id in database
  title: string;
  price: number;
  usualPrice?: number;
  description: string;
  duration: string;
  paddingBefore: number;
  paddingAfter: number;
}
```

### 2. Creating a New Pricing Page

1. First, add your services to the database:
```sql
INSERT INTO services (
    title, 
    price, 
    duration, 
    description, 
    usual_price, 
    is_premium, 
    appointment_type_id
)
VALUES 
(
    'YOUR SERVICE NAME',
    150.00,
    '1 hour 30 minutes',
    'SERVICE DESCRIPTION',
    null,
    false,
    'your-service-id'
);
```

2. Create your pricing page component:
```typescript
const YourPricingPage: React.FC = () => {
  const serviceOptions: ServiceOption[] = [
    {
      id: 'your-service-id',  // Must match appointment_type_id in database
      title: 'YOUR SERVICE NAME',
      price: 150,
      description: 'SERVICE DESCRIPTION',
      duration: '1 hour 30 minutes',
      paddingBefore: 15,
      paddingAfter: 30,
    }
  ];

  // ... rest of component implementation
};
```

## Data Flow

1. **Service Selection**
   - User selects a service on pricing page
   - Service option with `id` (appointment_type_id) is passed to booking flow

2. **Service Lookup**
   - `getServiceByAppointmentType` function fetches full service details from database:
   ```typescript
   const serviceDetails = await getServiceByAppointmentType(appointmentTypeId);
   ```

3. **Booking Creation**
   - PaymentStep uses the service UUID from database for booking creation
   - All service details are verified against database records

4. **Payment Processing**
   - Payment is processed using verified service details from database
   - Booking is created with correct service reference

## Best Practices

1. **Unique Identifiers**
   - Always use unique and descriptive appointment_type_ids
   - Follow the established naming pattern: 
     - Single services: 'service-name'
     - Multiple units: 'service-name-Nunits'
     - Premium services: 'premium-service-name'

2. **Data Consistency**
   - Keep prices and descriptions synchronized between frontend and database
   - Use database as single source of truth for service details

3. **Error Handling**
   - Always verify service exists in database before proceeding with booking
   - Handle cases where service lookup fails
   - Provide clear error messages to users

## Example: Adding a New Chemical Wash Service

1. **Database Entry**
```sql
INSERT INTO services (title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
    ('POWERJET CHEMICAL WASH', 150, '1 hour 30 minutes', 'SIGNATURE POWERJET SERVICE WITH DEEP CLEANING', null, false, 'powerjet-chemical-1unit'),
    ('POWERJET CHEMICAL WASH 2 UNITS', 280, '2 hours', 'SIGNATURE POWERJET SERVICE WITH DEEP CLEANING', null, false, 'powerjet-chemical-2units');
```

2. **Frontend Component**
```typescript
const ChemicalWashPricing: React.FC = () => {
  const serviceOptions: ServiceOption[] = [
    {
      id: 'powerjet-chemical-1unit',
      title: 'POWERJET CHEMICAL WASH',
      price: 150,
      description: 'SIGNATURE POWERJET SERVICE WITH DEEP CLEANING',
      duration: '1 hour 30 minutes',
      paddingBefore: 15,
      paddingAfter: 30,
    },
    {
      id: 'powerjet-chemical-2units',
      title: 'POWERJET CHEMICAL WASH 2 UNITS',
      price: 280,
      description: 'SIGNATURE POWERJET SERVICE WITH DEEP CLEANING',
      duration: '2 hours',
      paddingBefore: 15,
      paddingAfter: 30,
    }
  ];

  return (
    // ... component implementation
  );
};
```

## Troubleshooting

1. **Service Not Found**
   - Verify appointment_type_id matches between frontend and database
   - Check if service exists in database
   - Ensure proper error handling is in place

2. **Price Mismatch**
   - Always use database price for final calculations
   - Frontend prices should be for display only
   - Verify price updates are reflected in both places

3. **Booking Issues**
   - Check service UUID is correctly passed to booking creation
   - Verify all required service fields are present
   - Ensure proper error handling for service lookup failures
