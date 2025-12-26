-- Add new product fields
ALTER TABLE public.products
ADD COLUMN sku text,
ADD COLUMN tags text[] DEFAULT '{}',
ADD COLUMN materials text,
ADD COLUMN product_weight numeric,
ADD COLUMN box_weight numeric,
ADD COLUMN dimension_notes text;

-- Create index for tags search
CREATE INDEX idx_products_tags ON public.products USING GIN(tags);

-- Create unique index on SKU
CREATE UNIQUE INDEX idx_products_sku ON public.products(sku) WHERE sku IS NOT NULL;