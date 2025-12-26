-- Add 'inventory' to the product_status enum
ALTER TYPE product_status ADD VALUE 'inventory';

-- Add notes and go_live_date columns to products table
ALTER TABLE public.products ADD COLUMN notes text;
ALTER TABLE public.products ADD COLUMN go_live_date date;