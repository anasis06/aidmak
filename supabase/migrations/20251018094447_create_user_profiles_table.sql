/*
  # Create User Profiles Table

  1. Table Structure
    - Creates user_profiles table with all required fields
    - One-to-one relationship with users table
    - Cascade delete when user is deleted
    
  2. Security
    - Enable RLS
    - Add permissive policies for custom auth
    
  3. Features
    - Real-time enabled
    - Auto-updating timestamps
    - Performance indexes
*/

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  style_preferences jsonb DEFAULT '{}',
  body_type text,
  additional_notes text,
  measurements_metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_profile UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at DESC);

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create RLS policies (permissive for custom auth)
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

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create helper function to check if profile is complete
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
