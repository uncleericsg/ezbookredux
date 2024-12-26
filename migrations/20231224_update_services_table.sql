-- First, check if services table exists, if not create it
CREATE TABLE IF NOT EXISTS services (
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

-- Add appointment_type_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='services' 
                  AND column_name='appointment_type_id') THEN
        ALTER TABLE services ADD COLUMN appointment_type_id VARCHAR UNIQUE;
    END IF;
END $$;

-- Add usual_price column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='services' 
                  AND column_name='usual_price') THEN
        ALTER TABLE services ADD COLUMN usual_price DECIMAL(10,2);
    END IF;
END $$;

-- Add is_premium column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='services' 
                  AND column_name='is_premium') THEN
        ALTER TABLE services ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='services' 
                  AND column_name='created_at') THEN
        ALTER TABLE services ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name='services' 
                  AND column_name='updated_at') THEN
        ALTER TABLE services ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Create an index on appointment_type_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_services_appointment_type_id ON services(appointment_type_id);

-- Create a temporary table for new services
CREATE TEMP TABLE temp_services (
    title VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR NOT NULL,
    description TEXT,
    usual_price DECIMAL(10,2),
    is_premium BOOLEAN DEFAULT false,
    appointment_type_id VARCHAR UNIQUE
);

-- Insert into temporary table
INSERT INTO temp_services (title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
    ('1 SINGLE UNIT', 60, '45 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $20 POWERJET ON EVAP COIL DEEP CLEAN (OPTIONAL)', null, false, 'single'),
    ('2 UNITS', 60, '45 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 90, false, '2units'),
    ('3 UNITS', 90, '1 hour', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 120, false, '3units'),
    ('4 UNITS', 120, '1 hour', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 160, false, '4units'),
    ('5 UNITS', 150, '1 hour 30 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 180, false, '5units'),
    ('6 UNITS', 180, '1 hour 30 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 200, false, '6units'),
    ('PREMIUM SINGLE UNIT', 80, '45 minutes', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', null, true, 'premium-single'),
    ('PREMIUM 2 UNITS', 120, '1 hour', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 150, true, 'premium-2units'),
    ('PREMIUM 3 UNITS', 180, '1 hour', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 210, true, 'premium-3units'),
    ('PREMIUM 4 UNITS', 240, '1 hour', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 280, true, 'premium-4units'),
    ('PREMIUM 5 UNITS', 300, '1 hour 30 minutes', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 330, true, 'premium-5units'),
    ('PREMIUM 6 UNITS', 360, '1 hour 30 minutes', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 380, true, 'premium-6units'),
    ('AC FAULT CHECKING/SITE INSPECTION', 120, '1 hour', 'ADVANCED TROUBLESHOOTING FOR BLINKING OR SEVERE BREAKDOWNS', null, false, 'fault-checking');

-- Update existing services or insert new ones
INSERT INTO services (title, price, duration, description, usual_price, is_premium, appointment_type_id)
SELECT title, price, duration, description, usual_price, is_premium, appointment_type_id
FROM temp_services
ON CONFLICT (appointment_type_id) 
DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    duration = EXCLUDED.duration,
    description = EXCLUDED.description,
    usual_price = EXCLUDED.usual_price,
    is_premium = EXCLUDED.is_premium;

-- Drop temporary table
DROP TABLE temp_services;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_services_updated_at ON services;

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
