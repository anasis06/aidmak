/*
  # Create Profile Pictures Storage Bucket

  1. Storage Bucket
    - Create 'profile-pictures' bucket for user profile images
    - Configure as public bucket for easy access
    - Set file size limits and allowed MIME types

  2. Security Policies
    - Allow authenticated users to upload their own profile pictures
    - Allow public read access to profile pictures
    - Restrict file types to images only

  3. Configuration
    - Max file size: 5MB
    - Allowed types: image/jpeg, image/png, image/jpg, image/webp
    - Public access enabled for viewing
*/

-- Create the profile-pictures storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Drop existing policies if they exist
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

-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
