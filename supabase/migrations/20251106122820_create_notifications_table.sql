/*
  # Create Notifications Table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key) - Unique notification identifier
      - `user_id` (uuid, foreign key) - References users table
      - `title` (text) - Notification title
      - `message` (text) - Notification message/description
      - `type` (text) - Notification type (e.g., 'outfit_suggestion', 'offer', 'system')
      - `is_read` (boolean) - Whether notification has been read
      - `created_at` (timestamptz) - When notification was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `notifications` table
    - Add policy for users to read their own notifications
    - Add policy for users to update their own notifications (mark as read)
    - Add policy for system to insert notifications

  3. Notes
    - Notifications are user-specific
    - Users can only see their own notifications
    - Ordered by created_at for grouping by date
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Allow public to insert notifications"
  ON notifications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON notifications
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
