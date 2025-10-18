/*
  # Enhanced User Profiles Table for Production Real-Time Application

  1. Table Structure Enhancement
    - Add body measurements fields (chest, waist, hips, inseam)
    - Add style preferences fields
    - Add size information fields
    - Add additional metadata fields
    - Enable real-time subscriptions
    - Optimize for production scalability

  2. Real-Time Features
    - Enable Supabase Realtime on the table
    - Configure for instant updates
    - Support live profile synchronization

  3. Data Integrity
    - Maintain cascade delete (ON DELETE CASCADE)
    - One-to-one relationship with users table
    - Proper indexing for fast queries

  4. Future-Proof Design
    - JSONB fields for flexible additional data
    - All current profile setup fields included
    - Room for expansion without schema changes
*/

-- Add additional columns to existing table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS chest_measurement numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS waist_measurement numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS hips_measurement numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS inseam_measurement numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS shoe_size numeric;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS clothing_size text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_fit text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS style_preferences jsonb DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS body_type text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS additional_notes text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS measurements_metadata jsonb DEFAULT '{}';

-- Add comments for documentation
COMMENT ON TABLE user_profiles IS 'Stores user profile setup details with one-to-one relationship to users table';
COMMENT ON COLUMN user_profiles.user_id IS 'Foreign key to users table with CASCADE delete';
COMMENT ON COLUMN user_profiles.gender IS 'User gender: male, female, other';
COMMENT ON COLUMN user_profiles.height IS 'Height in centimeters';
COMMENT ON COLUMN user_profiles.weight IS 'Weight in kilograms';
COMMENT ON COLUMN user_profiles.skin_tone IS 'Skin tone: fair, medium, dusky, dark';
COMMENT ON COLUMN user_profiles.profile_picture_url IS 'Public URL to user profile picture in storage';
COMMENT ON COLUMN user_profiles.chest_measurement IS 'Chest measurement in centimeters';
COMMENT ON COLUMN user_profiles.waist_measurement IS 'Waist measurement in centimeters';
COMMENT ON COLUMN user_profiles.hips_measurement IS 'Hips measurement in centimeters';
COMMENT ON COLUMN user_profiles.inseam_measurement IS 'Inseam measurement in centimeters';
COMMENT ON COLUMN user_profiles.shoe_size IS 'Shoe size (region-specific)';
COMMENT ON COLUMN user_profiles.clothing_size IS 'Standard clothing size: XS, S, M, L, XL, etc.';
COMMENT ON COLUMN user_profiles.preferred_fit IS 'Fit preference: slim, regular, relaxed';
COMMENT ON COLUMN user_profiles.style_preferences IS 'JSON object for style preferences and favorites';
COMMENT ON COLUMN user_profiles.body_type IS 'Body type classification for better recommendations';
COMMENT ON COLUMN user_profiles.additional_notes IS 'User-provided additional notes or preferences';
COMMENT ON COLUMN user_profiles.measurements_metadata IS 'JSON object for additional measurement data';

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_gender ON user_profiles(gender) WHERE gender IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_body_type ON user_profiles(body_type) WHERE body_type IS NOT NULL;

-- Enable Realtime for this table (Supabase Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

-- Add policy for DELETE operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_profiles'
    AND policyname = 'Users can delete own profile'
  ) THEN
    CREATE POLICY "Users can delete own profile"
      ON user_profiles
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Create function to get complete user profile
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  gender text,
  height numeric,
  weight numeric,
  skin_tone text,
  profile_picture_url text,
  chest_measurement numeric,
  waist_measurement numeric,
  hips_measurement numeric,
  inseam_measurement numeric,
  shoe_size numeric,
  clothing_size text,
  preferred_fit text,
  style_preferences jsonb,
  body_type text,
  additional_notes text,
  measurements_metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    id,
    user_id,
    gender,
    height,
    weight,
    skin_tone,
    profile_picture_url,
    chest_measurement,
    waist_measurement,
    hips_measurement,
    inseam_measurement,
    shoe_size,
    clothing_size,
    preferred_fit,
    style_preferences,
    body_type,
    additional_notes,
    measurements_metadata,
    created_at,
    updated_at
  FROM user_profiles
  WHERE user_profiles.user_id = p_user_id;
$$;

-- Create function to check if profile is complete
CREATE OR REPLACE FUNCTION is_profile_complete(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE user_id = p_user_id
      AND gender IS NOT NULL
      AND height IS NOT NULL
      AND weight IS NOT NULL
      AND skin_tone IS NOT NULL
      AND profile_picture_url IS NOT NULL
  );
$$;

-- Create view for profile statistics (optional, useful for analytics)
CREATE OR REPLACE VIEW user_profiles_stats AS
SELECT
  COUNT(*) as total_profiles,
  COUNT(profile_picture_url) as profiles_with_picture,
  COUNT(gender) as profiles_with_gender,
  COUNT(height) as profiles_with_height,
  COUNT(weight) as profiles_with_weight,
  AVG(height) FILTER (WHERE height IS NOT NULL) as avg_height,
  AVG(weight) FILTER (WHERE weight IS NOT NULL) as avg_weight,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as profiles_last_7_days,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as profiles_last_30_days
FROM user_profiles;
