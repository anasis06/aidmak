/*
  # Create Wardrobe Tables

  1. New Tables
    - `wardrobe_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text) - Item name
      - `category` (text) - Tops, Bottom, Full Body, Layers, Shoes
      - `sub_category` (text) - Casual, Formal, Ethnic, Party, etc.
      - `image_url` (text) - URL to item image
      - `color` (text) - Primary color
      - `brand` (text, nullable)
      - `size` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `outfits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text) - Outfit name
      - `image_url` (text) - URL to outfit preview image
      - `items` (jsonb) - Array of wardrobe_item IDs
      - `last_tried_at` (timestamptz, nullable) - When outfit was last tried
      - `favorite` (boolean) - Is this a favorite outfit
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own wardrobe items and outfits
    - Authenticated users can CRUD their own data

  3. Indexes
    - Index on user_id for faster queries
    - Index on category for filtering
    - Index on last_tried_at for recent outfits
*/

CREATE TABLE IF NOT EXISTS wardrobe_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Tops', 'Bottom', 'Full Body', 'Layers', 'Shoes')),
  sub_category text,
  image_url text NOT NULL,
  color text,
  brand text,
  size text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  image_url text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  last_tried_at timestamptz,
  favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wardrobe items"
  ON wardrobe_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobe items"
  ON wardrobe_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe items"
  ON wardrobe_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe items"
  ON wardrobe_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own outfits"
  ON outfits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON outfits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON outfits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON outfits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_category ON wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_last_tried ON outfits(last_tried_at DESC);

INSERT INTO wardrobe_items (user_id, name, category, sub_category, image_url, color)
SELECT 
  id,
  'Sample Item',
  'Tops',
  'Casual',
  'unnamed 1.png',
  'beige'
FROM users
LIMIT 1;
