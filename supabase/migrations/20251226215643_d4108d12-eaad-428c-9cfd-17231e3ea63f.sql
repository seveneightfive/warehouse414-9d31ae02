-- Remove individual dimension columns
ALTER TABLE public.products 
  DROP COLUMN IF EXISTS product_width,
  DROP COLUMN IF EXISTS product_height,
  DROP COLUMN IF EXISTS product_depth,
  DROP COLUMN IF EXISTS product_weight,
  DROP COLUMN IF EXISTS box_width,
  DROP COLUMN IF EXISTS box_height,
  DROP COLUMN IF EXISTS box_depth,
  DROP COLUMN IF EXISTS box_weight;

-- Add text fields for dimensions
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS product_dimensions text,
  ADD COLUMN IF NOT EXISTS box_dimensions text;