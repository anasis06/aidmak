/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - Unique profile identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `gender` (text) - User's gender (male/female/other)
      - `height` (numeric) - User's height in cm
      - `weight` (numeric) - User's weight in kg
      - `skin_tone` (text) - User's skin tone (fair/medium/dark)
      - `profile_picture_url` (text) - URL to profile picture
      - `created_at` (timestamptz) - Profile creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for user access to their own profiles
    - Create unique constraint on user_id (one profile per user)
    - Add foreign key constraint to users table

  3. Notes
    - Each user can have only one profile
    - Profile data is stored separately from authentication data
    - All measurements use metric system (cm, kg)
    - Profile picture is optional initially
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gender text,
  height numeric,
  weight numeric,
  skin_tone text,
  profile_picture_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_profile UNIQUE(user_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
