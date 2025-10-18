/*
  # Update Profile Pictures Bucket Policies for Custom Auth

  1. Changes
    - Remove auth.uid() dependency since app uses custom authentication
    - Allow authenticated and anonymous users to upload
    - Maintain public read access
    - Add more permissive policies for custom auth flow

  2. Security
    - Public read access for viewing images
    - File size and type restrictions enforced at bucket level
*/

-- Drop existing restrictive policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public Access to Profile Pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Allow anyone to view profile pictures (public read)
CREATE POLICY "Public Access to Profile Pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Allow authenticated and anon users to upload profile pictures
CREATE POLICY "Allow profile picture uploads"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow authenticated and anon users to update profile pictures
CREATE POLICY "Allow profile picture updates"
ON storage.objects FOR UPDATE
TO authenticated, anon
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow authenticated and anon users to delete their profile pictures
CREATE POLICY "Allow profile picture deletes"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (bucket_id = 'profile-pictures');
