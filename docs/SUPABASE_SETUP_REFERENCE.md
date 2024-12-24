# Supabase Setup Reference

This document captures the Supabase configuration and setup from the `feature/eslint-prettier-fixes` branch for future implementation after Redux migration is complete.

## 1. Environment Variables

Found in `.env`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

## 2. Supabase Client Setup

From `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export type SupabaseClient = typeof supabase;
```

## 3. Database Schema Types

From `src/types/supabase.ts`:
```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'service_provider' | 'customer'
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'service_provider' | 'customer'
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: Partial<Insert>
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          block_street: string
          floor_unit: string
          postal_code: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          block_street: string
          floor_unit: string
          postal_code: string
          is_default?: boolean
        }
        Update: Partial<Insert>
      }
      services: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          usual_price: number | null
          duration_minutes: number
          padding_before_minutes: number
          padding_after_minutes: number
          is_active: boolean
        }
        Insert: {
          title: string
          price: number
          duration_minutes: number
          description?: string | null
          usual_price?: number | null
          padding_before_minutes?: number
          padding_after_minutes?: number
          is_active?: boolean
        }
        Update: Partial<Insert>
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          address_id: string
          scheduled_start: string
          scheduled_end: string
          padding_start: string
          padding_end: string
          status: string
          payment_status: string
          payment_id: string | null
          total_amount: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          service_id: string
          address_id: string
          scheduled_start: string
          scheduled_end: string
          padding_start: string
          padding_end: string
          total_amount: number
          status?: string
          payment_status?: string
          payment_id?: string | null
          notes?: string | null
        }
        Update: Partial<Insert>
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          booking_id: string
          user_id: string
          rating: number
          comment?: string | null
        }
        Update: Partial<Insert>
      }
      dashboard_stats: {
        Row: {
          id: string
          total_contracts: number
          active_customers: number
          monthly_revenue: number
          service_rate: number
          trends: {
            contracts: number
            customers: number
            revenue: number
            serviceRate: number
          }
          created_at: string
          updated_at: string
        }
      }
      activities: {
        Row: {
          id: string
          type: 'contract_signed' | 'service_completed' | 'payment_received' | 'feedback_received' | 'appointment_scheduled' | 'appointment_cancelled' | 'service_requested'
          title: string
          description: string | null
          user_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          type: 'appointment_reminder' | 'payment_due' | 'service_update' | 'contract_update' | 'system_alert' | 'feedback_request'
          title: string
          message: string
          user_id: string
          read: boolean
          priority: 'high' | 'normal' | 'low'
          action_url: string | null
          created_at: string
          updated_at: string
        }
      }
    }
    Enums: {
      user_role: 'admin' | 'service_provider' | 'customer'
      activity_type: 'contract_signed' | 'service_completed' | 'payment_received' | 'feedback_received' | 'appointment_scheduled' | 'appointment_cancelled' | 'service_requested'
      notification_priority: 'high' | 'normal' | 'low'
      notification_type: 'appointment_reminder' | 'payment_due' | 'service_update' | 'contract_update' | 'system_alert' | 'feedback_request'
    }
  }
}
```

## 4. Data Service Integration Points

From `src/services/data.ts`, the following operations need Supabase implementation:

### Booking Operations
- getUserBookings(userId: string)
- createBooking(bookingData: any)
- updateBooking(bookingId: string, data: any)

### Address Operations
- getUserAddresses(userId: string)
- addAddress(userId: string, addressData: any)
- updateAddress(addressId: string, data: any)

### Profile Operations
- getProfile(userId: string)
- updateProfile(userId: string, data: Partial<User>)

## 5. Required SQL Migrations

```sql
-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'service_provider', 'customer');
CREATE TYPE activity_type AS ENUM (
  'contract_signed',
  'service_completed',
  'payment_received',
  'feedback_received',
  'appointment_scheduled',
  'appointment_cancelled',
  'service_requested'
);
CREATE TYPE notification_priority AS ENUM ('high', 'normal', 'low');
CREATE TYPE notification_type AS ENUM (
  'appointment_reminder',
  'payment_due',
  'service_update',
  'contract_update',
  'system_alert',
  'feedback_request'
);

-- Create tables
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  block_street TEXT NOT NULL,
  floor_unit TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  usual_price DECIMAL,
  duration_minutes INTEGER NOT NULL,
  padding_before_minutes INTEGER DEFAULT 0,
  padding_after_minutes INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_id UUID REFERENCES services NOT NULL,
  address_id UUID REFERENCES addresses NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  padding_start TIMESTAMPTZ NOT NULL,
  padding_end TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  total_amount DECIMAL NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dashboard_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  total_contracts INTEGER NOT NULL DEFAULT 0,
  active_customers INTEGER NOT NULL DEFAULT 0,
  monthly_revenue DECIMAL NOT NULL DEFAULT 0,
  service_rate DECIMAL NOT NULL DEFAULT 0,
  trends JSONB NOT NULL DEFAULT '{"contracts":0,"customers":0,"revenue":0,"serviceRate":0}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  priority notification_priority NOT NULL DEFAULT 'normal',
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
```

## 6. Next Steps After Redux Migration

1. Update environment variable names to use VITE_ prefix
2. Run SQL migrations to create database schema
3. Set up Row Level Security (RLS) policies
4. Implement Supabase queries in data service
5. Add error handling and offline support
6. Set up real-time subscriptions where needed
7. Create integration tests
