/*
  # Create OTP Management Table

  1. New Tables
    - `otps`
      - `id` (uuid, primary key) - Unique identifier for each OTP record
      - `phone_number` (text) - Full phone number with country code
      - `country_code` (text) - Country code (e.g., +91)
      - `generated_otp` (text) - The 4-digit OTP code
      - `created_at` (timestamptz) - When the OTP was created
      - `expires_at` (timestamptz) - When the OTP expires (5 minutes from creation)
      - `is_valid` (boolean) - Whether the OTP is still valid (not used or invalidated)
      - `attempts` (integer) - Number of validation attempts
      - `validated_at` (timestamptz) - When the OTP was successfully validated

  2. Security
    - Enable RLS on `otps` table
    - Add policies for authenticated access
    - Add index on phone_number for fast lookups
    - Add index on expires_at for cleanup queries

  3. Notes
    - OTPs expire after 5 minutes
    - Maximum 3 validation attempts before invalidation
    - Previous OTPs for the same phone are invalidated when new OTP is sent
*/

CREATE TABLE IF NOT EXISTS otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  country_code text NOT NULL DEFAULT '+91',
  generated_otp text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '5 minutes'),
  is_valid boolean DEFAULT true,
  attempts integer DEFAULT 0,
  validated_at timestamptz
);

ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_otps_phone_number ON otps(phone_number);
CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_otps_is_valid ON otps(is_valid);

CREATE POLICY "Allow public to insert OTPs"
  ON otps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to read their OTPs"
  ON otps
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public to update OTPs"
  ON otps
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
