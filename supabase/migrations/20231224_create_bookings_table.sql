-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create bookings table with all necessary fields
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Customer Information
    customer_info JSONB NOT NULL,
    
    -- Service Information
    service_id VARCHAR NOT NULL,
    service_title VARCHAR NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    service_duration VARCHAR NOT NULL,
    service_description TEXT,
    
    -- Booking Details
    brands VARCHAR[] NOT NULL,
    issues VARCHAR[] NOT NULL,
    other_issue TEXT,
    is_amc BOOLEAN DEFAULT FALSE,
    
    -- Schedule Information
    scheduled_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_timeslot VARCHAR NOT NULL,
    
    -- Status and Timestamps
    status booking_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Payment Information
    payment_status VARCHAR,
    payment_intent_id VARCHAR,
    total_amount DECIMAL(10,2),
    tip_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Additional Metadata
    metadata JSONB,
    
    -- Constraints
    CONSTRAINT valid_customer_info CHECK (
        customer_info ? 'first_name' AND
        customer_info ? 'last_name' AND
        customer_info ? 'email' AND
        customer_info ? 'mobile' AND
        customer_info ? 'floor_unit' AND
        customer_info ? 'block_street' AND
        customer_info ? 'postal_code'
    )
);

-- Create index for common queries
CREATE INDEX idx_bookings_customer_email ON bookings ((customer_info->>'email'));
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_scheduled_datetime ON bookings (scheduled_datetime);
CREATE INDEX idx_bookings_payment_status ON bookings (payment_status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
