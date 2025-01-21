-- Create payment_sessions table
create table payment_sessions (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references bookings(id),
  user_id uuid references users(id),
  amount integer not null,
  currency text not null,
  status text not null,
  stripe_session_id text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index idx_payment_sessions_booking_id on payment_sessions(booking_id);
create index idx_payment_sessions_stripe_session_id on payment_sessions(stripe_session_id);
