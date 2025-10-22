/*
  # Create Offers Table

  1. New Tables
    - `offers`
      - `id` (uuid, primary key)
      - `brand` (text) - Brand name (e.g., Zara, H&M)
      - `discount` (text) - Discount headline (e.g., "Up to 60% Off")
      - `description` (text) - Brief description of the offer
      - `special_offer` (text, nullable) - Special promotional text
      - `image_url` (text) - URL or path to offer image
      - `validity_till` (date) - Expiration date of the offer
      - `categories` (text) - Eligible product categories
      - `terms` (text) - Terms and conditions
      - `redemption_steps` (jsonb) - Array of redemption instructions
      - `is_active` (boolean) - Whether the offer is currently active
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `offers` table
    - Add policy for all authenticated users to read active offers
    - Add policy for admin users to manage offers (future feature)

  3. Indexes
    - Index on `is_active` for faster queries
    - Index on `validity_till` for filtering expired offers
*/

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  discount text NOT NULL,
  description text NOT NULL,
  special_offer text,
  image_url text NOT NULL,
  validity_till date NOT NULL,
  categories text NOT NULL,
  terms text NOT NULL,
  redemption_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active offers"
  ON offers
  FOR SELECT
  TO authenticated
  USING (is_active = true AND validity_till >= CURRENT_DATE);

CREATE POLICY "Anyone can view active offers"
  ON offers
  FOR SELECT
  TO anon
  USING (is_active = true AND validity_till >= CURRENT_DATE);

CREATE INDEX IF NOT EXISTS idx_offers_is_active ON offers(is_active);
CREATE INDEX IF NOT EXISTS idx_offers_validity_till ON offers(validity_till);

INSERT INTO offers (brand, discount, description, special_offer, image_url, validity_till, categories, terms, redemption_steps, is_active)
VALUES
  (
    'Zara',
    'Up to 60% Off',
    'Trendy sweater and casual wears',
    'Flat 30% Off on New Arrivals',
    'Group.jpg',
    '2025-10-30',
    'Sweaters, Tops, Casual Wear',
    'Discount applicable only on selected items.',
    '["Tap \"Redeem Now.\"", "Open Zara (in-app or website).", "Add items from the offer to your cart.", "Discount applies automatically - pay to complete."]'::jsonb,
    true
  ),
  (
    'H&M',
    'Up to 60% Off',
    'Trendy sweater and casual wears',
    'Flat 30% Off on New Arrivals',
    'unnamed 1 (2).png',
    '2025-11-15',
    'Casual Office Wears',
    'Discount applicable only on selected items.',
    '["Tap \"Redeem Now.\"", "Open H&M (in-app or website).", "Add items from the offer to your cart.", "Discount applies automatically - pay to complete."]'::jsonb,
    true
  ),
  (
    'Mango',
    'Up to 50% Off',
    'Trendy sweater and casual wears',
    'Flat 25% Off on New Arrivals',
    'unnamed 1 (3).png',
    '2025-11-20',
    'Sweaters, Tops, Casual Wear',
    'Discount applicable only on selected items.',
    '["Tap \"Redeem Now.\"", "Open Mango (in-app or website).", "Add items from the offer to your cart.", "Discount applies automatically - pay to complete."]'::jsonb,
    true
  );
