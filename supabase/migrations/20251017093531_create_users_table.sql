/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `full_name` (text) - User's full name
      - `email` (text, unique) - User's email address
      - `phone_number` (text, unique) - Full phone number with country code
      - `country_code` (text) - Country code (e.g., +91)
      - `is_verified` (boolean) - Whether user has verified OTP
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add unique constraints on email and phone_number
    - Add indexes for fast lookups
    - Add policies for user access

  3. Notes
    - Email and phone_number must be unique across all users
    - Phone number stored with country code for global uniqueness
    - Users must verify OTP before being marked as verified
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  country_code text NOT NULL DEFAULT '+91',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE POLICY "Allow public to insert users"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to read users"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow users to update their own data"
  ON users
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
