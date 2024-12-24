-- Add appointment_type_id column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS appointment_type_id VARCHAR UNIQUE;

-- Insert services with their appointment type IDs
INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), '1 SINGLE UNIT', 60, '45 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $20 POWERJET ON EVAP COIL DEEP CLEAN (OPTIONAL)', null, false, 'single');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), '2 UNITS', 60, '45 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 90, false, '2units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), '3 UNITS', 90, '1 hour', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 120, false, '3units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), '4 UNITS', 120, '1 hour', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 160, false, '4units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), '5 UNITS', 150, '1 hour 30 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 180, false, '5units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), '6 UNITS', 180, '1 hour 30 minutes', 'COMPREHENSIVE NORMAL SERVICING OR ADDON $30 POWERJET ON EVAP COIL PER AC (OPTIONAL)', 200, false, '6units');

-- Premium Services
INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'PREMIUM SINGLE UNIT', 80, '45 minutes', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', null, true, 'premium-single');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'PREMIUM 2 UNITS', 120, '1 hour', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 150, true, 'premium-2units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'PREMIUM 3 UNITS', 180, '1 hour', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 210, true, 'premium-3units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'PREMIUM 4 UNITS', 240, '1 hour', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 280, true, 'premium-4units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'PREMIUM 5 UNITS', 300, '1 hour 30 minutes', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 330, true, 'premium-5units');

INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'PREMIUM 6 UNITS', 360, '1 hour 30 minutes', 'EVAP COILS POWERJET WASH DEEP CLEAN INCLUDED', 380, true, 'premium-6units');

-- Special Services
INSERT INTO services (id, title, price, duration, description, usual_price, is_premium, appointment_type_id)
VALUES 
  (uuid_generate_v4(), 'AC FAULT CHECKING/SITE INSPECTION', 120, '1 hour', 'ADVANCED TROUBLESHOOTING FOR BLINKING OR SEVERE BREAKDOWNS', null, false, 'fault-checking');
