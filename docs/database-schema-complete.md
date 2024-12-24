# iAircon Database Schema Documentation

## Schema Organization

### Public Schema (Main Application)

#### User Management
- `profiles` - Extended user profiles
- `users` - Application users
- `addresses` - User addresses linked to profiles

#### Booking System
- `bookings` - Main booking records
  - `id` (UUID, Primary Key)
  - `created_at` (DateTime)
  - `updated_at` (DateTime)
  - `scheduled_at` (DateTime)
  - `status` (String)
  - `customer_id` (UUID, Foreign Key)
  - `service_id` (UUID, Foreign Key)

#### Payment System
- `payments` - Payment records
  - `id` (UUID, Primary Key)
  - `payment_intent_id` (String, Unique)
  - `amount` (Int)
  - `currency` (String)
  - `status` (String)
  - `created_at` (DateTime)
  - `updated_at` (DateTime)
  - `booking_id` (UUID, Foreign Key)
  - `customer_id` (UUID, Foreign Key, Optional)
  - `service_id` (UUID, Foreign Key)

#### Service Management
- `services` - Available services
  - `id` (UUID, Primary Key)
  - `title` (String)
  - `description` (String)
  - `price` (Int)
  - `duration` (String)

#### Reviews & Feedback
- `reviews` - Customer reviews
  - `id` (UUID, Primary Key)
  - `rating` (Int)
  - `comment` (String, Optional)
  - `created_at` (DateTime)
  - `updated_at` (DateTime)
  - `booking_id` (UUID, Foreign Key)
  - `customer_id` (UUID, Foreign Key)

### Auth Schema (Supabase Auth)

#### Core Authentication
- `users` - Supabase auth users
- `sessions` - User sessions
- `refresh_tokens` - Session tokens
- `audit_log_entries` - Authentication logs

#### MFA & Security
- `mfa_factors` - Multi-factor authentication settings
- `mfa_challenges` - MFA challenge records
- `mfa_amr_claims` - MFA authentication method references

#### SSO Integration
- `sso_providers` - Single Sign-On providers
- `sso_domains` - Allowed SSO domains
- `saml_providers` - SAML configuration
- `identities` - External identity providers

### Storage Schema (Supabase Storage)
- `buckets` - Storage buckets
- `objects` - Stored files
- `migrations` - Storage system migrations

## Relationships

### User-Related
- User → Bookings (One-to-Many)
- User → Payments (One-to-Many)
- User → Reviews (One-to-Many)

### Booking-Related
- Booking → User (Many-to-One)
- Booking → Service (Many-to-One)
- Booking → Payments (One-to-Many)
- Booking → Reviews (One-to-Many)

### Service-Related
- Service → Bookings (One-to-Many)
- Service → Payments (One-to-Many)

## Common Queries

### Get Booking with Related Data
```sql
SELECT 
  b.*,
  u.first_name, u.last_name,
  s.title as service_title,
  p.status as payment_status
FROM bookings b
JOIN users u ON b.customer_id = u.id
JOIN services s ON b.service_id = s.id
LEFT JOIN payments p ON p.booking_id = b.id
WHERE b.id = '[booking_id]';
```

### Get User's Payment History
```sql
SELECT 
  p.*,
  s.title as service_title,
  b.scheduled_date
FROM payments p
JOIN services s ON p.service_id = s.id
JOIN bookings b ON p.booking_id = b.id
WHERE p.customer_id = '[user_id]'
ORDER BY p.created_at DESC;
```

## Notes
1. All timestamps (created_at, updated_at) are automatically managed
2. UUIDs are used for all primary keys
3. Foreign key relationships are properly constrained
4. Row Level Security (RLS) is implemented on all tables
5. Soft deletes are not implemented (no deleted_at columns)

## Security Considerations
1. Row Level Security (RLS) policies are in place
2. Authentication is handled by Supabase Auth
3. All sensitive operations require valid session
4. Database roles and permissions are managed by Supabase
